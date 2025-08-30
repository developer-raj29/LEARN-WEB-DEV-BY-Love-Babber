const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    co_code: [{ type: mongoose.Schema.Types.ObjectId }],
    div_code: [{ type: mongoose.Schema.Types.ObjectId }],
    usrnm: String,
    usrpwd: String,
    emailid: String,
    first_name: String,
    last_name: String,
    phone_num: String,
    details: String,
    admin: String,
    administrator: String,
    masterid: { type: mongoose.Schema.Types.ObjectId },
    jobworkcheck: mongoose.Schema.Types.Mixed
}, { collection: 'userSchema' }); 

module.exports = mongoose.model('userSchema', userSchema);
