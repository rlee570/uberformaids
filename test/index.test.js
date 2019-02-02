const app = require("../src/app")
const request = require("supertest");
const mongoClient = require('mongodb').MongoClient;

//mongo url+variables for mongo
const mongoUrl = "mongodb://localhost:27017/ubermaids"
let collection,client,database;

/*necessary because superagent doesn't use server.js
 to create the server so need to fix the state of the
 database after each test to ensure its clean everytime*/
beforeEach(async ()=>{
    //mongo setup
    try{
        client = await mongoClient.connect(mongoUrl,{ useNewUrlParser: true })
        database = client.db("ubermaids")
        collection = database.createCollection("helpers")
    }catch(err){
        console.error("Mongo failed to setup: ",err)
        client.close()
    }
    /*removes any previous setup data in the collection 
      from multiple runs of the server
      wouldn't be necessary in a production environment just
      for the sake of this test.*/
    try{
        collection = database.collection("helpers")
        collection.deleteMany()
    }catch(err){
        console.error("Mongo failed to remove anything: ",err)
        client.close()
    }
    //insert some maids 
    try{
        const maids = [
            {id:1,name:"niamh",lat:1,lon:100,rate:100,booked:false},
            {id:2,name:"siobhan",lat:1.3,lon:100.5,rate:150,booked:false},
            {id:3,name:"aoife",lat:1.5,lon:101,rate:200,booked:false}
        ]
        collection = database.collection("helpers")
        collection.insertMany(maids)
        client.close()
    }catch(err){
        console.error("Failed to insert dummy data: ",err)
        client.close()
    }
})

describe("route helpers",() =>{
    test("Should retrieve helpers data",async ()=>{
        const response = await request(app.callback()).get("/helpers")
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        response.body.forEach(x => {
            expect(x).toHaveProperty("_id");
            expect(x).toHaveProperty("id");
            expect(x).toHaveProperty("name");
            expect(x).toHaveProperty("lat");
            expect(x).toHaveProperty("lon");
            expect(x).toHaveProperty("rate");
            expect(x).toHaveProperty("booked");
        });
        expect(Object.keys(response.body).length).toBe(3)
    })
    test("Should retrieve helper by query parameters",async ()=>{
        const response = await request(app.callback())
            .get("/helpers")
            .query({lon:100})
            .query({lat:1})
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("lat");
        expect(response.body[0]).toHaveProperty("lon");
        expect(response.body[0]).toHaveProperty("rate");
        expect(response.body[0]).toHaveProperty("booked");
        expect(response.body[0].id).toBe(1);
        expect(response.body[0].name).toBe("niamh");
        expect(response.body[0].lat).toBe(1);
        expect(response.body[0].lon).toBe(100);
        expect(response.body[0].rate).toBe(100);
    })
    test("Should find helper by id",async () =>{
        const response = await request(app.callback()).get("/helpers/2")
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("lat");
        expect(response.body).toHaveProperty("lon");
        expect(response.body).toHaveProperty("rate");
        expect(response.body).toHaveProperty("booked");
        expect(response.body.id).toBe(2);
        expect(response.body.name).toBe("siobhan");
        expect(response.body.lat).toBe(1.3);
        expect(response.body.lon).toBe(100.5);
        expect(response.body.rate).toBe(150);
    })
})

describe("route book",()=>{
    test("Should book helper",async () =>{
        const response = await request(app.callback())
            .post("/helpers/2/book")
            .query({duration:5})
            .query({address:"12 Coolsville"})
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("text/plain");
        expect(response.text).toBe("Booked Helper siobhan for this address 12 Coolsville at this rate 750");
    })
    test("Call to helpers should change",async ()=>{
        //book a maid
        let response = await request(app.callback())
            .post("/helpers/2/book")
            .query({duration:5})
            .query({address:"12 Coolsville"})
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("text/plain");
        expect(response.text).toBe("Booked Helper siobhan for this address 12 Coolsville at this rate 750");
        //then expect the helpers response to be short one value as one maid is now booked
        response = await request(app.callback()).get("/helpers")
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        response.body.forEach(x => {
            expect(x).toHaveProperty("_id");
            expect(x).toHaveProperty("id");
            expect(x).toHaveProperty("name");
            expect(x).toHaveProperty("lat");
            expect(x).toHaveProperty("lon");
            expect(x).toHaveProperty("rate");
            expect(x).toHaveProperty("booked");
        });
        expect(Object.keys(response.body).length).toBe(2)
    })
})