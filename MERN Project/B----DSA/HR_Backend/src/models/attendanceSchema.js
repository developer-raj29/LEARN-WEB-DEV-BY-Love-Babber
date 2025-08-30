const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let attendanceSchema = new Schema({
    main_bk: {
        type: String
    },
    name: {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    Start_date: {
        type: Date
    },
    Start_datemilisecond: {
        type: Number
    },
    Time: {
        type: String
    },
    Photo: {
        type: String
    },
    filepath: [{
        type: String,
    }],
    filename: [{
        type: String
    }],
    
    MilloMeterReading: {
        type: String
    },
    Remark: {
        type: String
    },
    endday: {
        type: String
    },
    end_name:{
         type: String   
    },
    end_date:{
        type: Date
    },
    end_datemilisecond:{
         type: Number   
    },
    end_time:{
         type: String
    },
    end_photo:{
        type: String
    },
    end_millometer_reading:{
        type: String
    },
    end_remark:{
        type: String
    },
    end_filepath: [{
        type: String,
    }],
    end_filename: [{
        type: String
    }],
    start_latitude:{
        type: Number
    },
    start_longitude:{
        type: Number
    },
    end_latitude:{
        type: Number
    },
    end_longitude:{
        type: Number
    },
    entrydate: {
        type: Date
    },
    update: {
        type: String
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
    masterid: {
        type: String,
    },

});

module.exports = mongoose.model('attendanceSchema', attendanceSchema);