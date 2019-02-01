//Imports and declare koa and router
const koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const chalk = require('chalk')
const app = new koa();
const router = new Router();


//For helpers and the helpers request query
router.get("/helpers",ctx=>{
    console.log(ctx.request.query.hello)
    ctx.status=200
})

//Finding a helper by ID
router.get("/helper/:id",ctx=>{
    ctx.status=200
})

//Booking a Helper
router.post("/helpers/:id/book",ctx=>{
    let rate = duration * helperRate
    ctx.body =rate 
})

//Logging Access requests 
app.use(logger())
//Router for the routes
app.use(router.routes())
const server = app.listen(3000,() =>{
    console.log(chalk.rgb(16, 255, 0).bold(new Date +": "+ "Server startup on port: 3000"))
})

module.exports=server