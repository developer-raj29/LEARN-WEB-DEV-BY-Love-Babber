let mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Brand Schema
let authSchema = mongoose.Schema({
    sno: {
        type: Number,
    },
    leave_request: {
        type: Schema.Types.ObjectId, ref: 'requestSchema',
    },
    module_name: {
        type: String,
    },
    authouser_name: {
        type: String,
    },
    requestuser_name: {
        type: String,
    },        
    role:{
        type:String,
    },
    approved:{
        type:String,
    },
    approved_date: {
        type: Date
    },
    approved_datemilisecond: {
        type: Number
    },
    request_date: {
        type: Date
    },
    request_datemilisecond: {
        type: Number
    },    
    co_code:{
        type:String,
    },
    div_code:{
        type:String,
    },
    usrnm:{
        type:String,
    }    
});
let auth = module.exports = mongoose.model('auth', authSchema);