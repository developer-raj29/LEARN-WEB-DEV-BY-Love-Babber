let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addlessParameter = new Schema({ 
    Ded_Par_dsc_id  : {
        type: Schema.Types.ObjectId, ref:'Add_Less_Parameter_Master_Schema'
    },
    Ded_Par_dsc:String,
    Ded_Par_value:String,
    Ded_Par_typ:String,
    id :Schema.Types.ObjectId });

var Out_recieved_Entry_Arr = new Schema({ 
    Out_Entry_Id  : {
        type: Schema.Types.ObjectId, ref:'outstading'
    },
    main_bk:String,
    c_j_s_p:String,
    vouc_code:String,
    Rec_Amount:String,
    Add_Ded_Amt_Tot:String,
    Less_Ded_Amt_Tot:String,
    id :Schema.Types.ObjectId });

let outsdingSchema = mongoose.Schema({
    srno:{
        type:  Number,
    },
    main_bk:{
        type:  String,
    },
    c_j_s_p:{
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
    broker_Code :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    sl_Person :  {
        type: Schema.Types.ObjectId, ref:'accountSchema',
    },
    cash_chequeno  :  String,  
    cash_chequedate  :  String,
    Kasar  :  String,
    cash_amount  :  Number, //OutStanding Main Field;
    Bill_Amount  :  Number,
    Bill_Date  :  String, //OutStanding Main Field;
    Rec_Amount  :  Number,  //OutStanding Main Field;
    Amount_Deduction:String, // OutStanding Main Field;
    Add_Ded_Amt_Tot:String,
    Less_Ded_Amt_Tot:String,
    outstanding_balance  :  Number, // OutStanding Main Field;
    outstanding_amount  :  Number,
    op_outstanding_id  :  String,
    outstanding_id   :  {
        type: Schema.Types.ObjectId, ref:'outstading',
    },
    Int_Per:String,
    Intrest:String,
    discount:String,
    CRChgs:String,
    Chithi:String,
    cashBankIndex  :  String,
    Cbvouc_code:Number,
    CashBank_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    cash_debitamount :  Number,
    cash_creditamount :  Number,
    cash_amountcr  :  Number,
    cash_narrone  :  String ,
    cash_narrtwo : String,
    cashtypebank: {
        type: String,
    },
    BillColl_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    cash_eno: {
        type: String,
    },
    vouc_code: {
        type: Number,
    },
    SR_vouc_code:{
        type: Number,
    },
    PR_vouc_code:{
        type: Number,
    },
    cash_date: {
        type: Date,
    },
    Bill_date_in_billColl: {
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
    saleinvoice_id:{
        type: Schema.Types.ObjectId, ref:'salesorder_schema',
    },
    SaleEntry_id:{
        type: Schema.Types.ObjectId, ref:'salesorder_schema',
    },
    SaleReturn_id:{
        type: Schema.Types.ObjectId, ref:'salesorder_schema',
    },
    GaruEntry_id:{
        type: Schema.Types.ObjectId, ref:'salesorder_schema',
    },
    PurchaseReturn_id:{
        type: Schema.Types.ObjectId, ref:'salesorder_schema',
    },
    CrNote_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    DrNote_id:{
        type: Schema.Types.ObjectId, ref:'trans',
    },
    jv_Entry_id:{
        type: Schema.Types.ObjectId, ref:'trans',
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
    
    cash_remarks: {
        type: String,
    },
    cr_Days: {
        type: String,
    },
    due_On: {
        type: String,
    },
    cashCredit:{
        type:String,
    },
    ac_intrestper:{
        type:String,
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
    OS_Type:{
        type:String,
    },
    OS_Book:{
        type:String,
    },
    Chr:{
        type:String,
    },
    partyBillNo:{
        type:String,
    },
    partyBillDate: {
        type: Date,
    },
    partyBillDate_milisecond: {
        type: Number,
    },
    CNCL:String,
    CNCL_Time:Date,
    DUB_PARTY:String,
    CN_vouc_code:Number,
    JV_vouc_code:Number,
    addlessParameter:[addlessParameter],
    Out_recieved_Entry_Arr:[Out_recieved_Entry_Arr],
});
let outstading_schema = module.exports = mongoose.model('outstading_schema', outsdingSchema);