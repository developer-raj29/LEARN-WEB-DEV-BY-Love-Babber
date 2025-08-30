const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let vouchArray = new Schema({
    description: {
        type: String
    },
    book: {
        type: String
    },
    noType: {
        type: String
    },
    startNo: {
        type: String
    },
    EndNo: {
        type: String
    },
    Restart: {
        type: String
    },
    Ldate: {
        type: Date
    },
    active: {
        type: String
    },
    division: { type: Schema.Types.ObjectId, ref: 'divSchema' },
    Items: {
        type: String
    },
    d_c: {
        type: String
    },
    id: Schema.Types.ObjectId
});

let voucerMasterSchema = new Schema({
    ModuleName: {
        type: String,
    },
    vouchArray: {
        type: [vouchArray]
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
    },
}, {
    collection: 'voucerMasterSchema'
});

module.exports = mongoose.model('voucerMasterSchema', voucerMasterSchema);