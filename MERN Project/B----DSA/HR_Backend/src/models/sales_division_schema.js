const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sales_division_schema = new Schema({
    description: {
        type: String
    },
    code: {
        type: String
    },
    fg_type: {
        type: [{ type: Schema.Types.ObjectId, ref: 'fg_type_schema' }],
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
    collection: 'sales_division_schema'
});

module.exports = mongoose.model('sales_division_schema', sales_division_schema);