const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let task_managerSchema = new Schema({
    main_bk: {  //Task
        type: String
    },
    c_j_s_p: {  //TaskPlan    //TaskAssign
        type: String
    },
    vouc_code: {
        type: Number
    },
    date: {
        type: Date
    },
    datemilisecond: {
        type: Number
    },
    task_name:{ //plan name
        type: String
    },
    duedate: {
        type: Date
    },
    duedatemilisecond: {
        type: Number
    },
    task_description: { //Remarks
        type: String
    },
    filepath: [{
        type: String
    }],
    filename: [{
        type: String
    }],
    task_employee: {
        type: Schema.Types.ObjectId, ref: 'employeeSchema',
    },
    task_priority: { 
        type: Schema.Types.ObjectId, ref: 'taskSchema',
    },
    task_status: {
        type: String,
    },
    pending_status : {
        type: String
    },
    pending_end_date: {
        type: Date
    },
    pending_end_datemilisecond: {
        type: Number
    },
    end_time:{
        type: Date
    },
    end_time_datemilisecond: {
        type: Number
    },
    query_date: {
        type: Date
    },
    query_datemilisecond: {
        type: Number
    },
    next_due_date: {
        type: Date
    },
    next_due_date_datemilisecond: {
        type: Number
    },
    pending_remark:{
        type: String
    },
    update: {
        type: String
    },
    update_datemilisecond: {
        type: Number
    },
    delete: {
        type: String
    },
    del: {
        type: String
    },
    co_code: {
        type: String,
    },
    div_code: {
        type: String,
    },
    usrnm: {
        type: String
    },
    entrydate: {
        type: Date,
    },
    entry_datemilisecond: {
        type: Number,
    },
    masterid: {
        type: String,
    },

});

module.exports = mongoose.model('task_managerSchema', task_managerSchema);