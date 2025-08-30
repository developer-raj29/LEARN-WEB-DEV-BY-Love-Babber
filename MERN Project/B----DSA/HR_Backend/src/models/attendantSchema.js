const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let attendantSchema = new Schema({
    attendant_name: {
        type: String
    },
    designation: {
        type: Schema.Types.ObjectId, ref: 'designationSchema',
    },
    mobile: {
        type: Number
    },
    email_id: {
        type: String
    },
    remark: {
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
    collection: 'attendantSchema'
});

module.exports = mongoose.model('attendantSchema', attendantSchema);