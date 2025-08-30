let mongoose = require('mongoose');

// Brand Schema
let masterSchema = mongoose.Schema({
    custname: {
        type: String,
    },
    emp_limit: {
        type: Number,
    },
},{
    collection: 'masterSchema'
});
 module.exports = mongoose.model('masterSchema', masterSchema);