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

var loangroup = new Schema({
  loan_date: {
    type: Date
  },
  loan_datemilisecond: {
    type: Number,
  },
  loanremarks: {
    type: String,
  },
  loandc: {
    type: String,
  },
  loanamount: Number,
  loaninstallment: Number,
  loanbalance: Number,
});

let employeeSchema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  full_name: {
    type: String
  },
  documents: {
    type: String
  },
  machine_code: {
    type: String,
    unique:true
  },
  // machine: {
  //   type: String
  // },
  gender_radio: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  reporting_manager: {
    type: String
  },
  emergencyContact: {
    type: Number
  },
  father_name: {
    type: String
  },
  mother_name: {
    type: String
  },
  spouseName: {
    type: String
  },
  marital_status: {
    type: String
  },
  physicallyChallenged: {
    type: String
  },
  designation: {
    type: Schema.Types.ObjectId, ref: 'designationSchema',
  },
  sales_person: {
    type: String
  },
  department: {
    type: Schema.Types.ObjectId, ref: 'departmentSchema',
  },
  birth_date: {
    type: Date
  },
  birth_datemilisecond: {
    type: Number,
  },
  joining: {
    type: Date
  },
  joining_datemilisecond: {
    type: Number,
  },
  PfJoiningDate: {
    type: Date
  },
  PfJoining_datemilisecond: {
    type: Number,
  },
  EpsJoiningDate: {
    type: Date
  },
  EpsJoining_datemilisecond: {
    type: Number,
  },
  EpsExitDate: {
    type: Date
  },
  EpsExit_datemilisecond: {
    type: Number,
  },
  grade: {
    type: Schema.Types.ObjectId, ref: 'employeegradeSchema',
  },
  salary_from: {
    type: Date
  },
  salary_cycle: {
    type: Number
  },
  salary_from_datemilisecond: {
    type: Number,
  },
  salaryAccess: {
    type: String,
  },
  aayushman_card: {
    type: String,
  },
  attendanceMode: {
    type: String,
  },
  email: {
    type: String,
  },
  resign: {
    type: Date
  },
  resign_datemilisecond: {
    type: Number,
  },
  category: {
    type: Schema.Types.ObjectId, ref: 'employeecategorySchema',
  },
  machine: {
    type: Schema.Types.ObjectId, ref: 'machineSchema',
  },
  resign_reason: {
    type: Schema.Types.ObjectId, ref: 'resignSchema',
  },
  branch: {
    type: Schema.Types.ObjectId, ref: 'branchSchema',
  },
  weekly_leave: {
    type: String
  },
  work_place: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  house_owner: {
    type: String
  },
  bank: {
    type: Schema.Types.ObjectId, ref: 'bankSchema',
  },
  ifsc_code: {
    type: String
  },
  upiId: {
    type: String
  },
  bank_acc_holder: {
    type: String
  },
  salary_mode: {
    type: String
  },
  pan: {
    type: String
  },
  bank_ac_no: {
    type: String
  },
  // dispensory: {
  //   type: Schema.Types.ObjectId, ref: 'esiSchema',
  // },
  esi_applicable: {
    type: String
  },
  no1: {
    type: String
  },
  effective_from: {
    type: Date
  },
  effectivefrom_datemilisecond: {
    type: Number
  },
  pf_application: {
    type: String
  },
  pt_application: {
    type: String
  },
  lwf_application: {
    type: String
  },
  eps_application: {
    type: String
  },
  hps_application: {
    type: String
  },
  no2: {
    type: String
  },
  adhar_no: {
    type: String
  },
  adhar_enroll_no: {
    type: String
  },
  uan_no: {
    type: String
  },
  pfNumber: {
    type: String
  },
  EsiNumber: {
    type: String
  },
  application_division: {
    type: String
  },
  remarks: {
    type: String
  },
  //employee address
  present_add: {
    type: String,
  },
  address: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  addressLine3: {
    type: String,
  },
  city: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  state: {
    type: Schema.Types.ObjectId, ref: 'stateSchema',
  },
  employee_reg_no: {
    type: String
  },
  phone_no: {
    type: Number
  },
  Photo: {
    type: String
  },
  filepath: [{
      type: String,
  }],
  filename: [{
      type: String
  }],
  entrydate: {
    type: Date
  },
  Photo: {
      type: String
  },

  mobile_no: {
    type: Number
  },
  usrpwd: {
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
  gratutity: {
    type: String
  },
  bonus: {
    type: String
  },
  days: {
    type: String
  },
  ol_appl: {
    type: String
  },
  faceid: {
    type: String
  },
  imageid: {
    type: String
  },
  
  default_shift: {
    type: Schema.Types.ObjectId, ref: 'shiftSchema'
  },
  // policy: {
  //   type: Schema.Types.ObjectId, ref: 'esiSchema'
  // },
  bond_amt: {
    type: Number
  },
  grat_amt: {
    type: Number
  },
  bond_du: {
    type: String
  },
  bond_to: {
    type: String
  },
  emi_rs: {
    type: String
  },
  emi_per: {
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
  loangroup: [loangroup],
});

module.exports = mongoose.model('employeeSchema', employeeSchema);