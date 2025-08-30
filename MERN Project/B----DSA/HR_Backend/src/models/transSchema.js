let mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addlessParameter = new Schema({ 
    YDed_Par_dsc_id  : {
        type: Schema.Types.ObjectId, ref:'Add_Less_Parameter_Master_Schema'
    },
    YDed_Par_dsc:String,
    YDed_Par_value:String,
    YDed_Par_typ:String,
    id :Schema.Types.ObjectId });

var addlessPar_CNDN = new Schema({ 
    Sno  : {
        type: Number,
    },
    Parameter_Type:String,
    Parameter_id:String,
    Parameter_Desc:String,
    Calculate:String,
    Rate:Number,
    Amount:Number,
    id :Schema.Types.ObjectId });
    
let transSchema = mongoose.Schema({
    srno:{
        type:  Number,
    },
    expense:{
        type: Schema.Types.ObjectId, ref:'expenseSchema',
    },
    application_id:{
        type: Schema.Types.ObjectId, ref:'CustomerApplicationSchema',
    },
    type:{
        type:  String,
    },
    narration:{
        type:  String,
    },
    narration2:{
        type:  String,
    },
    main_bk:{
        type:  String,
    },
    main_bk_posting:{
        type:  String,
    },
    c_j_s_p:{
        type: String,
    },
    post:{
        type: String,
    },
    paid:{
        type: String,
    },
    d_c:{
        type:  String,
    },
    cashtrn:{
        type:  Number,
    },
    cashac_name :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    cashoppac_name :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },

    Dealer_name :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },

    broker_Code :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    sl_Person :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    cash_chequeno  :  String,  
    cBill_No:String,
    Chgs:String,
    Bal:String,
    Adjusted:String,
    cash_chequedate  :  String,
    Ref_Date: String,
    cash_amount  :  Number,
    cash_debitamount :  Number,
    cash_creditamount :  Number,
    cash_amountcr  :  Number,
    cash_narrone  :  String ,
    cash_narrtwo : String,
    cash_narr : String,
    Bill_No:String,
    Bill_Amt:Number,
    O_S_Bal:Number,
    Date:Date,
    Cheq_Clear_Date:Date,
    Datemilisecond: {
        type: Number,
    },
    place:String,
    Balance_Due:String,
    Int_Due:String,
    Bal_Int:String,
    Days:String,
    Int_Per:String,
    Intrest:String,
    discount:String,
    CRChgs:String,
    Chithi:String,
    Amount_Deduction:String,
    Add_Amount_Deduction:String,
    Less_Amount_Deduction:String,
    Amt_Settled:String,
    Kasar:String,
    tot_Cash_Amount:String,
    Chq_No:String,
    chq_date:Date,
    chq_datemilisecond: {
        type: Number,
    },
    deposit_date:Date,
    deposit_datemilisecond: {
        type: Number,
    },
    Cheq_Amt:String,
    Cash_Amt:String,
    draw_branch:String,
    
    Drawee_Bank:{
        type: Schema.Types.ObjectId, ref:'bank_details_Schema',
    },
    cashtypebank: {
        type: String,
    },
    cash_eno: {
        type: String,
    },
    cash_remarks: {
        type: String,
    },
    cr_Days: {
        type: String,
    },
    cashCredit:{
        type:String,
    },
    ac_intrestper:{
        type:String,
    },
    vouc_code: {
        type: Number,
    },
    renewal_date: {
        type: Date,
    },
    renewal_edatemilisecond: {
        type: Number,
    },
    cash_date: {
        type: Date,
    },
    cash_edatemilisecond: {
        type: Number,
    },
    cash_bank_name :
    {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    cash_type: {
        type: String,
    },
    // saleinvoice_id:{
    //     type: String,
    // },
    SaleEntry_id:{
        type: Schema.Types.ObjectId, ref:'pur_order_Schema',
    },
    SaleReturn_id:{
        type: Schema.Types.ObjectId, ref:'pur_order_Schema',
    },
    GaruEntry_id:{
        type: Schema.Types.ObjectId, ref:'pur_order_Schema',
    },
    Tax_Voucher_id:{
        type: Schema.Types.ObjectId, ref:'pur_order_Schema',
    },
  
    recivedoutwardchlan_id:{
        type: Schema.Types.ObjectId, ref:'pur_order_Schema',
    },
    bill_No: {
        type: String,
    },
    bill_Datemilisecond: {
        type: Number,
    },
    Deductee:{
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    ExpenseAc:{
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    HSN_SAC:{
        type: String,
    },
    GSTIN:{
        type: String,
    },
    Basic_Amt:{
        type: String,
    },
    TDS_On:String,
    ITC:{
        type: String,
    },
    Tax_Type:{
        type: Schema.Types.ObjectId, ref:'taxSchema',
    },
    TDS_Per:{
        type: String,
    },
    GST_Per:{
        type: String,
    },
    Tot_Debit: {
        type: Number,
    },
    Tot_Credit: {
        type: Number,
    },
    totcash_amt: {
        type: Number,
    },
    tot_amtdebit: {
        type: Number,
    },
    tot_amtcridit: {
        type: Number,
    },
    outStandingArr:{
        type:Array,
    },
    cash_remarks: {
        type: String,
    },
    co_code:{
        type:String,
    },
    div_code:{
        type:String,
    },
    del:{
        type: String
    },
    entrydate:{
        type: String
    },
    delete:{
        type: String
    },
    update:{
        type: String
    },
    usrnm:{
        type:String,
    }, 
    masterid:{
        type:String,
    },
    PrdtSrno:{
        type:String,
    },
    op_main_bk:{
        type:  String,
    },
    op_c_j_s_p:{
        type:  String,
    },
    op_co_code:{
        type:String,
    },
    op_div_code:{
        type:String,
    },
    Item_Detail:{
        type:Array,
    },
    add_Total:{
        type:String,
    },
    less_Total:{
        type:String,
    },
    Item_Total:{
        type:String,
    },
    Gst_Total:{
        type:String,
    },
    CashBank_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    CrNote_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    DrNote_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    filepath: [{
        type: String,
      }],
      filename: [{
        type: String
      }],
    CN_vouc_code:Number,
    CNCL: String,
    CNCL_Time:Date,
    Chaq_Return : String,

    order_no:String,
    invoice_num : String,

    GST:String,
    Amount:Number,
    Qty:String,
    Weight:String,
    addlessParameter:[addlessParameter],
    addlessPar_CNDN:[addlessPar_CNDN],
});

let trans_cash = module.exports = mongoose.model('transSchema', transSchema);


