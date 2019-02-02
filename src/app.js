//Imports and declare koa and router
const koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const chalk = require('chalk');
const mongoClient = require('mongodb').MongoClient;
const app = new koa();
const router = new Router();

//mongo url+variables for mongo
const mongoUrl = "mongodb://localhost:27017/ubermaids"
let collection,client,database;

//Setup mongo client.
//this essentially exists for tests only.
const setupMongo = async ()=>{
    try{
        client = await mongoClient.connect(mongoUrl)
        database = client.db("ubermaids")
        collection = database.collection("helpers")
    }catch(err){
        console.error(chalk.red("Couldn't locate that id: "),err)
        ctx.body="Couldn't locate that id"
        ctx.status=500
    }
}

//For helpers and the helpers request query
router.get("/helpers",async ctx=>{
    let result;
    await setupMongo()
    if(ctx.query.lat && ctx.query.lon){
        try{
            //lat and lon need to be floats
            result = await collection.find({lat:parseFloat(ctx.query.lat),lon:parseFloat(ctx.query.lon),booked:false}).toArray()
        }catch(err){
            console.error(chalk.red("Couldn't locate that id: "),err)
            ctx.body="Couldn't locate that id"
            ctx.status=500
        }
        ctx.body=result
    }else{
        try{
            result = await collection.find({booked:false}).toArray()
        }catch(err){
            console.error(chalk.red("Couldn't find any maids: "),err)
            ctx.body="Couldn't find any maids"
            ctx.status=500
        }
        ctx.body=result
    }
})

//Finding a helper by ID
router.get("/helpers/:id",async ctx=>{
    let result;
    await setupMongo()
    try{
        //the id is a String needs to be of type int to retrieve maid data
        result = await collection.findOne({id:parseInt(ctx.params.id)})
    }catch(err){
        console.error(chalk.red("Couldn't locate that id:"),err)
        ctx.body="Couldn't locate that id"
        ctx.status=500
    }
    ctx.body = result
})

//Booking a Helper
router.post("/helpers/:id/book",async ctx=>{
    let helper;
    await setupMongo()
    if(ctx.query.duration && ctx.query.address){
        try{
            //the id is a String needs to be of type int to retrieve maid data
            helper = await collection.findOne({id:parseInt(ctx.params.id)})
            ctx.status = 200
        }catch(err){
            console.error(chalk.red("There is a problem with finding that maid:"),err)
            ctx.body="There is a problem booking that maid. It is likely cause by an incorrect id"
            ctx.status=500
        }
        let rate = ctx.query.duration * helper.rate
        ctx.body = "Booked Helper "+helper.name+ " for this address "+ctx.query.address+ " at this rate "+rate
    }else if(!ctx.query.duration){
        console.error(chalk.red("There is no duration specified"))
        ctx.body="There is no duration specified"
        ctx.status=500
    }else if(!ctx.query.address){
        console.error(chalk.red("There is no address specified"))
        ctx.body="There is no address specified"
        ctx.status=500  
    }else{
        console.error(chalk.red("There is no address specified or duration")) 
        ctx.status=500
    }
})

//Logging Access requests 
app.use(logger())
//Router for the routes
app.use(router.routes())
//export app
module.exports=app