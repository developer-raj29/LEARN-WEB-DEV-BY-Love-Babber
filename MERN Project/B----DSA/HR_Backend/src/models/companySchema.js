const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Product
let companySchema = new Schema({
    com_name: {
        type: String,
    },
    sdate: {
        type: Date,
    },
    edate: {
        type: Date,
    },
    mast_nm: {
        type: String,
    },
    masterid: {
        type:String,
    },
    Dealer_miscsno: {
        type: String,
    },
    Q_T_K: {
        type: String,
    },
    co_code: {
        type: String,
    },
}, {
    collection: 'companySchema'
});

module.exports = mongoose.model('companySchema', companySchema);