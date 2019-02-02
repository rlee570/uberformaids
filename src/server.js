//imports
const app = require("../src/app");
const chalk = require('chalk');
const mongoClient = require('mongodb').MongoClient;
//port 
const port = process.env.PORT || 3000;
//mongo url+variables for mongo
const mongoUrl = "mongodb://localhost:27017/ubermaids"
let collection,client,database;

//Server setup and mongo intialising
const server = app.listen(port,async () =>{
    console.log(chalk.rgb(16, 255, 0).bold(new Date +": "+ "Server startup on port: 3000"))
    //mongo setup
    try{
        client = await mongoClient.connect(mongoUrl)
        database = client.db("ubermaids")
        collection = database.createCollection("helpers")
        
    }catch(err){
        console.error(chalk.red("Mongo failed to setup: "),err)
    }
    /*removes any previous setup data in the collection 
      from multiple runs of the server
      wouldn't be necessary in a production environment just
      for the sake of this test.*/
    try{
        collection = database.collection("helpers")
        collection.deleteMany()
    }catch(err){
        console.error(chalk.red("Mongo failed to remove anything: "),err)
    }
    //insert some maids 
    try{
        const maids = [
            {id:1,name:"niamh",lat:1,lon:100,rate:100},
            {id:2,name:"siobhan",lat:1.3,lon:100.5,rate:150},
            {id:3,name:"aoife",lat:1.5,lon:101,rate:200}
        ]
        collection = database.collection("helpers")
        collection.insertMany(maids)
    }catch(err){
        console.error(chalk.red("Failed to insert dummy data: "),err)
    }
})