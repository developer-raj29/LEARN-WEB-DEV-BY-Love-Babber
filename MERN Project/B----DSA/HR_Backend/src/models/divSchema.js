const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Product
let divSchema = new Schema({
    div_mast: {
        type: String,
    },
    div_code: {
        type: String,
    },
    ac_add2: {
        type: String,
    },
    ac_place: {
        type: Schema.Types.ObjectId, ref:'citySchema',
    },
    ac_state: {
        type: Schema.Types.ObjectId, ref:'stateSchema',
    },
    ac_pin: {
        type: String,
    },
    propreietor: {
        type: String,
    },
    ac_pan: {
        type: String,
    },
    ac_pho: {
        type: String,
    },
    ac_cin: {
        type: String,
    },
    ac_phfax: {
        type: String,
    },
    ac_mobno: {
        type: String,
    },
    ac_gstin: {
        type: String,
    },
    printurl: {
        type: String,
    },
    // datafile: {
    //     type: String,
    // },
    filepath: {
        type: String,
    },
    filename: {
        type: String
    },
    prvyr_datafile: {
        type: String,
    },
    ac_wbsite: {
        type: String,
    },
    ac_email: {
        type: String,
    },
    ac_interfclanguge: {
        type: String,
    },
    ssevadomain: {
        type: String,
    },
    ssevausr: {
        type: String,
    },
    ssevapwd: {
        type: String,
    },
    sms_port_no: {
        type: String,
    },
    smttp_client: {
        type: String,
    },
    email_user: {
        type: String,
    },
    email_pwd: {
        type: String,
    },
    email_port: {
        type: String,
    },
    jurisdiction: {
        type: String,
    },
    ac_topline: {
        type: String,
    },
    ac_midline: {
        type: String,
    },
    ac_bottline: {
        type: String,
    },
    contract_qty: {
        type: String,
    },
    weight_calcution: {
        type: String,
    },
    character_case: {
        type: String,
    },
    /////
    bank1: {
        type: String,
    },
    bank2: {
        type: String,
    },
    bank3: {
        type: String,
    },
    bank4: {
        type: String,
    },
    bank_add: {
        type: String,
    },
    bank_city: {
        type: String,
    },
    bank_code: {
        type: String,
    },
    swift_code: {
        type: String,
    },
    /////
    fix: {
        type: String,
    },
    com_code: {
        type: String,
    },
    masterid:{
        type:String,
    },
},{
    collection: 'divSchema'
});

module.exports = mongoose.model('divSchema', divSchema);