const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let attenSchema = new Schema({
  month: {
    type: String
  },
  // radio_typ: {
  //   type: String
  // },
  category: {
    type: Schema.Types.ObjectId, ref: 'CategorySchema',
  },
  full_name: {
    type: Schema.Types.ObjectId, ref: 'employeeSchema',
  },
  shift_name: {
    type: Schema.Types.ObjectId, ref: 'shiftSchema',
  },
  in_time: {
    type: String
  },
  out_time: {
    type: String
  },
  atd_type: {
    type: String
  },
  remarks: {
    type: String
  },
  dalatten_date: {
    type: Date
  },
  dalatten_datemilisecond: {
    type: Number
  },
  employee_name: {
    type: Schema.Types.ObjectId, ref: 'employeeSchema',
  },
  machine_code: {
    type: String,
  },
  dalatten_shiftnm: {
    type: Schema.Types.ObjectId, ref: 'shiftSchema',
  },
  dalatten_intime: {
    type: String,
  },
  dalatten_outtime: {
    type: String,
  },
  tot_hrs: {
    type: Number,
  },
  dalatten_total_hour: {
    type: Number,
  },
  dalatten_overtime: {
    type: Number,
  },
  dalatten_overtimehrs: {
    type: Number,
  },
  dalatten_overtimemin: {
    type: Number,
  },
  dalatten_atdtype: {
    type: Schema.Types.ObjectId, ref: 'leaveSchema',
  },
  dalatten_remarks: {
    type: String,
  },
  edit_by: {
    type: String,
  },
  co_code: {
    type: String,
  },
  div_code: {
    type: String,
  },
  authouser_name: {
    type: String,
  },
  status: {
    type: String,
  },
  status_remarks: {
    type: String,
  },
  status_date: {
    type: Date
  },
  status_datemilisecond: {
    type: Number
  },
  status_user: {
    type: String
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
}, {
  collection: 'attenSchema'
});

module.exports = mongoose.model('attenSchema', attenSchema);