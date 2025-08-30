const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var leaveorgroup = new Schema({
    leave_name: {
        type: Schema.Types.ObjectId, ref: 'leaveSchema',
    },
    nos: {
        type: String,
    },
    hrs: {
        type: String,
    },
});
var salrygroup = new Schema({
    salaryhead_name: {
        type: Schema.Types.ObjectId, ref: 'salaryhdSchema',
    },
    salryhd_sign: {
        type: String,
    },
    salryhd_calcb: {
        type: String,
    },
    salryhd_round: {
        type: String,
    },
    amount: {
        type: String,
    },
    salryhd_odr: Number,
    salryhd_vlu: Number,
});
let salarySchema = new Schema({
    main_bk: {
        type: String
    },
    month: {
        type: String
    },
    employee: {
        type: Schema.Types.ObjectId, ref: 'employeeSchema',
    },
    gross_salary: {
        type: Number
    },
    basic: {
        type: Number
    },
    hra: {
        type: Number
    },
    conv: {
        type: Number
    },
    medical: {
        type: Number
    },
    others: {
        type: Number
    },
    basic_calc: {
        type: Number
    },
    hra_calc: {
        type: Number
    },
    conv_calc: {
        type: Number
    },
    medical_calc: {
        type: Number
    },
    others_calc: {
        type: Number
    },
    
    total_attendance: {
        type: Number
    },
    calculated_gross: {
        type: Number
    },
    ot_hrs: {
        type: Number
    },
    amt: {
        type: Number
    },
    total_add: {
        type: Number
    },
    total_less: {
        type: Number
    },
    less_advance: {
        type: Number
    },
    less_loan: {
        type: Number
    },
    less_pf: {
        type: Number
    },
    less_pt: {
        type: Number
    },
    less_esic: {
        type: Number
    },
    remark: {
        type: String
    },
    net_salary: {
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
    },
    salryhd_or_group: [salrygroup],
    leave_or_group: [leaveorgroup]
});

module.exports = mongoose.model('salarySchema', salarySchema);