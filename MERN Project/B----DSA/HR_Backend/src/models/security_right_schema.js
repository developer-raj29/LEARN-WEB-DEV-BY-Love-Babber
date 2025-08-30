let mongoose = require('mongoose');

// Brand Schema
let securitySchema = mongoose.Schema({
    sno: {
        type: Number,
    },
    right_name: {
        type: String,
    },
    right_desc: {
        type: String,
    },
    co_code:{
        type:String,
    },
    div_code:{
        type:String,
    },
    usrnm:{
        type:String,
    },
    request:{
        type:String,
    }
});
let security = module.exports = mongoose.model('security', securitySchema);