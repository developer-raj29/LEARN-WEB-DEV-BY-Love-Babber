const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CustomerApplicationSchema = new Schema({
    stage: {
        type: String
    },
    documents: {
        type: String
    },
    bank: {
        type: Schema.Types.ObjectId, ref: 'bankSchema',
    },
    firm: {
        type: Schema.Types.ObjectId, ref: 'divSchema',
    },
    ApplicationNo: {
        type: Number
    },
    RefferenceNo: {
        type: String
    },
    bank2: {
        type: Schema.Types.ObjectId, ref: 'bankSchema',
    },
    firm2: {
        type: Schema.Types.ObjectId, ref: 'divSchema',
    },
    date: {
        type: Date
    },
    date_datemilisecond: {
        type: Number
    },
    Applicant: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    CoApplicant: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Guranter: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    VehicleNo: {
        type: String
    },
    engineNo: {
        type: String
    },
    chasisNo: {
        type: String
    },
    Make: {
        type: Schema.Types.ObjectId, ref: 'makeSchema',
    },
    Model: {
        type: Schema.Types.ObjectId, ref: 'modelSchema',
    },
    Variant: {
        type: Schema.Types.ObjectId, ref: 'variantSchema',
    },
    Executive: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    SubExecutive: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Dealer: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    SubDealer: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    LosNo: {
        type: String
    },
    FI: {
        type: String
    },
    CIBILScore: {
        type: String
    },
    ExShowroomPrice: {
        type: String
    },
    LoanAmount: {
        type: String
    },
    Tenure: {
        type: String
    },

    // Stage Login
    Login_remark: {
        type: String,
    },

    // Stage SoftApproval
    SoftApproval_bank: {
        type: Schema.Types.ObjectId, ref: 'bankSchema',
    },
    SoftApproval_firm: {
        type: Schema.Types.ObjectId, ref: 'divSchema',
    },
    SoftApproval_crcc: {
        type: String
    },
    SoftApproval_date: {
        type: Date
    },
    SoftApproval_date_datemilisecond: {
        type: Number
    },
    SoftApproval_Amount: {
        type: String
    },
    SoftApproval_Tenure: {
        type: String
    },
    SoftApproval_remark: {
        type: String
    },
    // Stage Reject
    Reject_query: {
        type: String
    },
    Reject_date: {
        type: Date
    },
    Reject_date_datemilisecond: {
        type: Number
    },
    // Stage Cancelled
    Cancelled_query: {
        type: String
    },
    Cancelled_date: {
        type: Date
    },
    Cancelled_date_datemilisecond: {
        type: Number
    },
    // Stage Approved
    Approved_bank: {
        type: Schema.Types.ObjectId, ref: 'bankSchema',
    },
    Approved_firm: {
        type: Schema.Types.ObjectId, ref: 'divSchema',
    },
    Approved_crcc: {
        type: String
    },
    Approved_date: {
        type: Date
    },
    Approved_date_datemilisecond: {
        type: Number
    },
    Approved_Amount: {
        type: String
    },
    Approved_Tenure: {
        type: String
    },
    Approved_remark: {
        type: String
    },
    // Stage UnderDisbursement
    UnderDisbursement_bank: {
        type: Schema.Types.ObjectId, ref: 'bankSchema',
    },
    UnderDisbursement_firm: {
        type: Schema.Types.ObjectId, ref: 'divSchema',
    },
    UnderDisbursement_crcc: {
        type: String
    },
    UnderDisbursement_date: {
        type: Date
    },
    UnderDisbursement_date_datemilisecond: {
        type: Number
    },
    UnderDisbursement_Amount: {
        type: String
    },
    UnderDisbursement_Tenure: {
        type: String
    },
    UnderDisbursement_Query: {
        type: String
    },
    UnderDisbursement_Interest: {
        type: String
    },
    UnderDisbursement_EMI: {
        type: String
    },

    // Stage Disbursement
    Disbursement_date: {
        type: Date
    },
    Disbursement_date_datemilisecond: {
        type: Number
    },
    Disbursement_bank: {
        type: Schema.Types.ObjectId, ref: 'bankSchema',
    },
    Disbursement_PendingbankAmount: {
        type: Number
    },
    Disbursement_firm: {
        type: Schema.Types.ObjectId, ref: 'divSchema',
    },
    Disbursement_loanAmount: {
        type: String
    },
    Disbursement_tenure: {
        type: String
    },
    Disbursement_rate: {
        type: String
    },
    Disbursement_emi: {
        type: String
    },
    Disbursement_emiStartDate: {
        type: Date
    },
    Disbursement_emiStartDate_datemilisecond: {
        type: Number
    },
    Disbursement_pf: {
        type: String
    },
    Disbursement_stamp: {
        type: String
    },
    Disbursement_installment: {
        type: String
    },
    Disbursement_mi: {
        type: String
    },
    Disbursement_sk: {
        type: String
    },
    Disbursement_other: {
        type: String
    },
    Disbursement_netBankAmountReceived: {
        type: String
    },
    Disbursement_rto: {
        type: String
    },
    Disbursement_other1: {
        type: String
    },
    Disbursement_netPaidToDealer: {
        type: String
    },
    Disbursement_loanCreditAC: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Disbursement_loanType: {
        type: Schema.Types.ObjectId, ref: 'CustomerCategorySchema',
    },
    Disbursement_payOutPercentage: {
        type: String
    },
    Disbursement_grossCosReceived: {
        type: String
    },
    Disbursement_tdsPercentage: {
        type: String
    },
    Disbursement_gstPercentage: {
        type: String
    },
    Disbursement_netComReceived: {
        type: String
    },
    Disbursement_dealer: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Disbursement_commPercentage: {
        type: String
    },
    Disbursement_commAmount: {
        type: String
    },
    Disbursement_executive: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Disbursement_executiveComRupees: {
        type: String
    },
    Disbursement_subExecutive: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    Disbursement_subExecutiveComRupees: {
        type: String
    },
    Disbursement_netRemainingAmount: {
        type: String
    },
    Disbursement_remark: {
        type: String
    },
    Disbursement_commPaid: {
        type: String
    },
    Disbursement_commReceived: {
        type: String
    },
    Disbursement_limitAmount: {
        type: Number
    },
    Disbursement_limitRemark: {
        type: String
    },
    Disbursement_limitMobile: {
        type: String
    },
    Disbursement_BankLimit: {
        type: Boolean,
        default: false
    },
    Disbursement_documents: {
        type: String
    },
    remark1: {
        type: String
    },
    remark2: {
        type: String
    },
    newBank: {
        type: String
    },
    newAccNo: {
        type: String
    },
    newBranch: {
        type: String
    },
    newIFSCCode: {
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
    }
}, {
    collection: 'CustomerApplicationSchema'
});

module.exports = mongoose.model('CustomerApplicationSchema', CustomerApplicationSchema);