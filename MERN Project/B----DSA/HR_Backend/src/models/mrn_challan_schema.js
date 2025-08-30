let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mrngroup = new Schema({
    mrn_item_name: {
        type: Schema.Types.ObjectId, ref: 'productrawSchema',
    },
    mrn_description: {
        type: String,
    },
    mrn_price: Number,
    mrn_qty: Number,
    mrn_discount: Number,
    total_amt_before: Number,
    total_amt: Number,
    id: Schema.Types.ObjectId
});


let mrn_Schema = mongoose.Schema({
    main_bk: {
        type: String,
    },
    d_c: {
        type: String,
    },
    srno: {
        type: String,
    },
    mrn_entry_no: {
        type: String,
    },
    vouc_code: {
        type: Number,
    },
    mrn_entry_date: {
        type: Date,
    },
    mrn_entry_datemilisecond: {
        type: Number,
    },
    mrn_prty_name: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    mrn_rmks: {
        type: String,
    },
    mrn_bill_no: {
        type: String,
    },
    mrn_bill_date: {
        type: Date,
    },
    mrn_bill_datemilisecond: {
        type: Number,
    },
    mrn_po_no: {
        type: String,
    },
    mrn_po_date: {
        type: Date,
    },
    mrn_po_datemilisecond: {
        type: Number,
    },
    subware_house: {
        type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
    },
    subware_houseloc: {
        type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
    },
    destination_location: {
        type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
    },
    tot_sooq: {
        type: Number,
    },
    tot_amtso: {
        type: Number,
    },
    tot_discount: {
        type: Number,
    },
    tot_amtbefore: {
        type: Number,
    },
    mrn_remarks: {
        type: String,
    },
    mrn_grand_total: {
        type: Number,
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
    mrn_or_group: [mrngroup],
});


module.exports = mongoose.model('mrn_Schema', mrn_Schema);


