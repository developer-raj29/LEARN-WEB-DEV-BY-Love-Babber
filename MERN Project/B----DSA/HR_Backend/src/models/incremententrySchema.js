const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var salrygroup = new Schema({
  salaryhead_name: {
    type: Schema.Types.ObjectId, ref: 'salaryhdSchema',
  },
  salryhd_sign: {
    type: String,
  },
  salryhd_calcb: {
    type: String,
  },
  salryhd_round: {
    type: String,
  },
  amount: {
    type: String,
  },
  salryhd_sno: Number,
  salryhd_odr: Number,
  salryhd_vlu: Number,
});
let incremententrySchema = new Schema({
  month: {
    type: String
  },
  employee_name: {
    type: Schema.Types.ObjectId, ref: 'employeeSchema',
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  //employee salary
  salary_stru: {
    type: Schema.Types.ObjectId, ref: 'salarystruSchema',
  },
  gross_sal: {
    type: String
  },
  g_sal: {
    type: String
  },
  salary: {
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
  },
  salryhd_or_group: [salrygroup],
});

module.exports = mongoose.model('incremententrySchema', incremententrySchema);
