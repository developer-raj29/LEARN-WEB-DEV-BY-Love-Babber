const { app } = require("./index");
const { connectDb } = require("./config/db");


app.listen(process.env.PORT,async ()=>{
    await connectDb()
    console.log("SoftHR listing on port ",process.env.PORT)
})