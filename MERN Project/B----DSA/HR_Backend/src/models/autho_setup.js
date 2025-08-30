let mongoose = require('mongoose');

var rolesetup = new mongoose.Schema({
    role: {
        type: String,
    },
    user: {
        type: String,
    },
});

// Brand Schema
let authosetupSchema = mongoose.Schema({
    module_name: {
        type: String,
    },

    module_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'securitySchema',
    },    
    rolesetup: [rolesetup],    
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
let authosetup = module.exports = mongoose.model('authosetup', authosetupSchema);