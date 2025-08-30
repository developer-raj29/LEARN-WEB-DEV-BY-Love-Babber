const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let requestSchema = new Schema({
    module_name: {
        type: String,
    },
    request_amount: {
        type: Number
    },
    request_installment: {
        type: Number
    },
    request_interest: {
        type: Number
    },
    request_loan_purpose: {
        type: String
    },
    request_typ: {
        type: Schema.Types.ObjectId, ref: 'leaveSchema',
    },
    request_number: {
        type: Number
    },
    employee_name: {
        type: Schema.Types.ObjectId, ref: 'employeeSchema',
    },
    request_date: {
        type: Date
    },
    request_datemilisecond: {
        type: Number
    },
    request_fromdate: {
        type: Date
    },
    request_fromdatemilisecond: {
        type: Number
    },
    request_todate: {
        type: Date
    },
    request_todatemilisecond: {
        type: Number
    },
    leave_reason: {
        type: Schema.Types.ObjectId, ref: 'resignSchema',
    },      
    request_nos: {
        type: Number,
    },
    request_remarks: {
        type: String,
    },
    del: {
        type: String
    },
    authouser_name: {
        type: String,
    },
    status:{
        type:String,
    },
    status_remarks:{
        type:String,
    },
    status_date: {
        type: Date
    },
    status_datemilisecond: {
        type: Number
    },
    status_user: {
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
    collection: 'requestSchema'
});

module.exports = mongoose.model('requestSchema', requestSchema);