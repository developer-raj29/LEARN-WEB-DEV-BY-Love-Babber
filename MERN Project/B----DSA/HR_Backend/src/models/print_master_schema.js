const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let print_schema = new Schema({
    Description: {
        type: String
    },
    Code: {
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
    collection: 'print_schema'
});

module.exports = mongoose.model('print_schema', print_schema);