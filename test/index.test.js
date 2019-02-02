const app = require("../src/app")
const request = require("supertest");

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
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("lat");
        expect(response.body[0]).toHaveProperty("lon");
        expect(response.body[0]).toHaveProperty("rate");
        expect(response.body[0]).toHaveProperty("booked");
        expect(response.body[0].id).toBe(2);
        expect(response.body[0].name).toBe("siobhan");
        expect(response.body[0].lat).toBe(1.3);
        expect(response.body[0].lon).toBe(100.5);
        expect(response.body[0].rate).toBe(150);
    })
})

describe("route book",()=>{
    test("Should book helper",async () =>{
        const response = await request(app.callback()).get("/helper/2")
        expect(response.status).toEqual(200);
    })
})