const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let onlineportal_schema = new Schema({
    online_portal_name: {
        type: String
    },
    associated_ledger: {
        type: String
    },
    co_code: {
        type: String,
    },
    div_code: {
        type: String,
    },
    user: {
        type: String
    },
    masterid: {
        type: String
    },
    entry: {
        type: Date
    },
    entry_datemilisecond: {
        type: Number
    },
    update: {
        type: Date
    },
    update_datemilisecond: {
        type: Number
    },
    delete: {
        type: Date
    },
    delete_datemilisecond: {
        type: Number
    },
    del: {
        type: String
    }
}, {
    collection: 'onlineportal_schema'
});

module.exports = mongoose.model('onlineportal_schema', onlineportal_schema);