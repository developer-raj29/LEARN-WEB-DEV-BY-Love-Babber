const mongoose = require("mongoose")
require("dotenv").config();

 
const connectDb=()=>{
    console.log("Connected",process.env.MONGO_URL)
    return mongoose.connect(process.env.MONGO_URL)
}

module.exports={connectDb}