let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addamt = new Schema({
    particular_add: {
        type: Schema.Types.ObjectId, ref: 'addless_mast'
    },
    Parameter_Desc: String,
    Parameter_Type: String,
    Parameter_Value: String,
    Posting_Ac: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Order: Number,
    particular_amount: Number,
    id: Schema.Types.ObjectId
});


var lessamt = new Schema({
    particular_less: {
        type: Schema.Types.ObjectId, ref: 'addless_mast'
    },
    Parameter_Desc: String,
    Parameter_Type: String,
    Parameter_Value: String,
    Posting_Ac: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Order: Number,
    particular_amtless: Number,
    id: Schema.Types.ObjectId
});

var row_mat_group = new Schema({
    row_mat: {
        type: Schema.Types.ObjectId, ref: 'rawmatSchema'
    },

    plan_no: Number,
    Raw_Qty: Number,
    plan_id: {
        type: Schema.Types.ObjectId, ref: 'plan_entrySchema',
    },
    plan_grp_id: {
        type: String,
    },
    id: Schema.Types.ObjectId
});

var taxorgroup = new Schema({
    tax_table: {
        type: String,
    },
    ExpenseAc: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    HSN_SAC: {
        type: String,
    },
    cost_center: {
        type: Schema.Types.ObjectId, ref: 'cost_center_schema',
    },
    Tax_Type: {
        type: Schema.Types.ObjectId, ref: 'taxSchema',
    },
    Basic_Amt: {
        type: String,
    },
    TDS_On: String,
    GST_Per: {
        type: String,
    },
    TDS_Per: {
        type: String,
    },
});

var salesordergroup = new Schema({
    so_sno: Number,
    plan_no: Number,
   
    category: {
        type: Schema.Types.ObjectId, ref: 'fgSchema',
    },
    brandid: {
        type: Schema.Types.ObjectId, ref: 'brandSchema'
    },
    // subware_house: {
    //     type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
    // },
    so_disc: {
        type: Schema.Types.ObjectId, ref: 'fgSchema',
    },
    plan_grp_id: {
        type: String,
    },
    plan_id: {
        type: Schema.Types.ObjectId, ref: 'plan_entrySchema',
    },
    WIP_name: {
        type: Schema.Types.ObjectId, ref: 'WIP_mastSchema',
    },
    sales_ord_id: {
        type: Schema.Types.ObjectId, ref: 'pur_order_Schema',
    },

    sales_ord_grp_id: String,
    outin_qty: Number,
    ocrate: Number,
    order_price: Number,
    sopacper_carten: Number,
    so_qty: Number,
    free_qty: Number,
    disc_rupee: Number,
    so_discount: Number,
    so_gstrate: Number,
    so_taxvalue: Number,
    so_beforedisamt: Number,
    so_afttaxvalue: Number,
    total_amt: Number,
    total_amt_before: Number,
    sd2id: String,
    sd2srno: String,
    pendqty: Number,
    qty_bal: Number,
    qty_exe: Number,
    Bs_qty: Number,
    Rej_qty: Number,
    WIP_Rem: String,



    id: Schema.Types.ObjectId
});

let SalesSchema = mongoose.Schema({
    main_bk: {
        type: String,
    },
    d_c: {
        type: String,
    },
    c_j_s_p: {
        type: String,
    },
    so_no: {
        type: String,
    },
    vouc_code: {
        type: Number,
    },
    ws_no: {
        type: Number,
    },
    so_date: {
        type: Date,
    },
    so_datemilisecond: {
        type: Number,
    },
    entry_Datemilisecond: {
        type: Number,
    },
    srno: {
        type: String,
    },    
    DPCD: {
        type: Schema.Types.ObjectId, ref: 'production_deptSchema',
    },
    OPDPCD: {
        type: Schema.Types.ObjectId, ref: 'production_deptSchema',
    },
    production_dept: {
        type: Schema.Types.ObjectId, ref: 'production_deptSchema',
    },
    Ship_party_Name: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    sl_Person: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    sales_email: {
        type: String,
    },
    Ship_party:
    {
        type: String,
    },
    Ship_party_gst:
    {
        type: String,
    },
    Ship_party_add:
    {
        type: String,
    },
    Ship_party_State: {
        type: Schema.Types.ObjectId, ref: 'stateSchema',
    },
    Ship_party_City: {
        type: Schema.Types.ObjectId, ref: 'citySchema',
    },
    subware_house: {
        type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
    },
    subware_houseloc: {
        type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
    },
    buy_cus_name: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    zone: {
        type: Schema.Types.ObjectId, ref: 'zoneSchema',
    },
    party_email: {
        type: String,
    },
    opposite_ac:
    {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    buy_rmks: {
        type: String,
    },
    buy_pono: {
        type: String,
    },
    buy_podt: {
        type: Date,
    },
    Vehicle: {
        type: String,
    },
    Transport: {
        type: String,

    },
    transporter: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    buy_podtmilisecond: {
        type: Number,
    },
    sale_radio: {
        type: String,
    },
    tot_sooq: {
        type: Number,
    },
    gross_total: {
        type: Number,
    },
    tot_amtso: {
        type: Number,
    },
    tot_beforedisamt: {
        type: Number
    },
    tot_taxvalue: {
        type: Number
    },
    tot_discount: {
        type: Number,
    },
    tot_amtbefore: {
        type: Number,
    },
    gst_taxamtot12: {
        type: Number,
    },
    gst_taxamtot18: {
        type: Number,
    },
    grand_total: {
        type: Number,
    },
    so_remarks: {
        type: String,
    },

    co_code: {
        type: String,
    },
    div_code: {
        type: String,
    },
    usrnm: {
        type: String,
    },
    masterid: {
        type: String,
    },
    del: {
        type: String,
    },
    cash_edate: {
        type: String,
    },
    update: {
        type: String,
    },
    delete: {
        type: String,
    },
    cancel: {
        type: String,
    },
    tot_qty_raw: Number,
    sales_or_group: [salesordergroup],
    tax_or_group: [taxorgroup],
    add_details: [addamt],
    less_details: [lessamt],
    row_mat_group: [row_mat_group],
    rmfgtype: {
        type: String,
    },

    einvackno: {
        type: String,
    },
    einvackdt: {
        type: Date,
    },
    einvackdtmilisecond: {
        type: Number,
    },
    einvirn: {
        type: String,
    },
    einvewbno: {
        type: String,
    },
    einvewbdt: {
        type: Date,
    },
    einvewbvalid: {
        type: Date,
    },
    einvewbdtdtmilisecond: {
        type: Number,
    },
    einvewbvaliddtmilisecond: {
        type: Number,
    },
    Deductee: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    GSTIN: {
        type: String,
    },
    bill_no: {
        type: String,
    },
    bill_dt: {
        type: Date,
    },
    bill_dtmilicond: {
        type: Number,
    },
    cash_bank_name: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    ITC: {
        type: String,
    },
    TDS_Amt: {
        type: Number,
    },
    Narration: {
        type: String,
    },
    cash_amount: {
        type: Number,
    },
    trans_id: [{ type: Schema.Types.ObjectId, ref: 'trans' }],
    trans_id_CB: { type: Schema.Types.ObjectId, ref: 'trans' },
    challan_no: {
        type: String,
    },
    challan_date: {
        type: Date,
    },

    challan_date_Milisecend: {
        type: Number,
    },
    Bank: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    BSR_Code: {
        type: String,
    },
    Chq_No: {
        type: String,
    },
    Chq_Date: {
        type: String,
    },
    Selected_Amt_Of_Bills: {
        type: String,
    },
    interest: {
        type: Number,
    },
    late_fees: {
        type: Number,
    },
    CNCL: String,
    CNCL_Time: Date,
});

let SalesOrder = module.exports = mongoose.model('SalesOrder', SalesSchema);


