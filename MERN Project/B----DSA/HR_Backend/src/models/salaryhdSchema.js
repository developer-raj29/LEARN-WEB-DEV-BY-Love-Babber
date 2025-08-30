const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let salaryhdSchema = new Schema({
  salaryhead_name: {
    type: String
  },
  posting_account: {
    type: String
  },
  head_type: {
    type: String
  },
  max_limit: {
    type: String
  },
  calculation_basis: {
    type: String
  },
  value: {
    type: String
  },
  per_of_field: {
    type: String
  },
  round_of_zero: {
    type: String
  },
  order: {
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
    collection: 'salaryhdSchema'
});

module.exports = mongoose.model('salaryhdSchema', salaryhdSchema);