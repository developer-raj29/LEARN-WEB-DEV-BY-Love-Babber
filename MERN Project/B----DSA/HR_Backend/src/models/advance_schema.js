const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let adavanceSchema = new Schema({
    month: {
        type: String
    },
    radio_typ: {
        type: String
    },
    amount: {
        type: String,
    },
    machine_code: {
        type: String
    },
    advance_date: {
        type: Date
    },
    advance_datemilisecond: {
        type: Number
    },
    employee_name: {
        type: Schema.Types.ObjectId, ref: 'employeeSchema',
    },
    salary: {
        type: String,
    },
    advance_amt: {
        type: Number,
    },
    advance_remarks: {
        type: String,
    },
    del: {
        type: String
    },
    user: {
        type: String
    },
    masterid: {
        type: String
    },
    co_code: {
        type: String,
    },
    div_code: {
        type: String,
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
}, {
    collection: 'adavanceSchema'
});

module.exports = mongoose.model('adavanceSchema', adavanceSchema);