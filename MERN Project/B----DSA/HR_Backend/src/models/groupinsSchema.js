const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let groupinsSchema = new Schema({
  Policy_No: {
    type: String
  },
  insurance_company: {
    type: String
  },
  policy_value: {
    type: String
  },
 
  Total_pre_amount: {
    type: String
  },
  Employee_Prem_Contri: {
    type: String
  },
  Employee_Prem_Contri: {
    type: String
  },
  calculation_basis: {
    type: String
  },
  month_deduct_premium: {
    type: String
  },
  polity_period_start: {
    type: String
  },
  polity_period_end: {
    type: String
  },
  order: {
    type: String
  },
  min_salary: {
    type: String
  },
  max_salary: {
    type: String
  },
  eligiable_amt_ins: {
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
  }
},{
    collection: 'groupinsSchema'
});

module.exports = mongoose.model('groupinsSchema', groupinsSchema);