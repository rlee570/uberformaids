const app = require("../src/app")
const request = require("supertest");

describe("route helpers",() =>{
    test("Should retrieve helpers data",async ()=>{
        const response = await request(app.callback()).get("/helpers")
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        response.body.forEach(x => {
            expect(x).toHaveProperty("id");
        });
        expect(Object.keys(response.body).length).toBe(3)
    })
})