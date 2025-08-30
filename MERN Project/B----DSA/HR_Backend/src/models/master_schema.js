let mongoose = require('mongoose');


let masterSchema = mongoose.Schema({
    custname: {
        type: String,
    },
});
let master_login = module.exports = mongoose.model('master_login', masterSchema);