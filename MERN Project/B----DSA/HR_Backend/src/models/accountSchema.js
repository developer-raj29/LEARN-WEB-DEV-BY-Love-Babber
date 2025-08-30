const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let bank_group = new Schema({
  bank_city: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  bank_name: {
    type: String
  },
  bank_branch: {
    type: String
  },
  bank_pin: {
    type: String
  },
  bank_fax: {
    type: String
  },
  bank_ifsc: {
    type: String
  },
  bnk_ac_no: {
    type: String
  },
  swift_code: {
    type: String
  },

  id: Schema.Types.ObjectId
});
let accountSchema = new Schema({
  main_bk: {
    type: String,
  },
  Alias: {
    type: String
  },
  cutomer_name: {
    type: String
  },
  cutomer_category: {
    type: Schema.Types.ObjectId, ref: 'CustomerCategorySchema',
  },
  cutomer_type: {
    type: Schema.Types.ObjectId, ref: 'CustomerTypeSchema',
  },
  father_name: {
    type: String
  },
  mother_name: {
    type: String
  },
  gender: {
    type: String
  },
  martial_status: {
    type: String
  },
  guarantee: {
    type: String
  },
  ACCode: {
    type: Number
  },
  ACName: {
    type: String
  },
  GroupName: {
    type: Schema.Types.ObjectId, ref: 'groupSchema',
  },
  PanNumber: {
    type: String
  },
  date: {
    type: Date
  },
  date_datemilisecond: {
    type: Number
  },
  Dealer: {
    type: Schema.Types.ObjectId, ref: 'accountSchema',
  },

  // Present Address
  PresentAddress: {
    type: String
  },
  PresentAddressLine2: {
    type: String
  },
  PresentCity: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  PresentPhoneNumber: {
    type: String
  },
  PresentMobileNumber: {
    type: String
  },
  PresentPincode: {
    type: String
  },

  // Permanent Address
  PermanentAddress: {
    type: String
  },
  PermanentAddressLine2: {
    type: String
  },
  PermanentCity: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  PermanentPhoneNumber: {
    type: String
  },
  PermanentMobileNumber: {
    type: String
  },
  PermanentPincode: {
    type: String
  },

  // Work Address
  WorkFirm: {
    type: Schema.Types.ObjectId, ref: 'divSchema',
  },
  WorkAddress: {
    type: String
  },
  WorkAddressLine2: {
    type: String
  },
  WorkCity: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  WorkPhoneNumber: {
    type: String
  },
  WorkMobileNumber: {
    type: String
  },
  WorkPincode: {
    type: String
  },

  // Refference1 Address
  Refference1Address: {
    type: String
  },
  Refference1AddressLine2: {
    type: String
  },
  Refference1City: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  Refference1PhoneNumber: {
    type: String
  },
  Refference1MobileNumber: {
    type: String
  },
  Refference1Pincode: {
    type: String
  },

  // Refference2 Address
  Refference2Address: {
    type: String
  },
  Refference2AddressLine2: {
    type: String
  },
  Refference2City: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  Refference2PhoneNumber: {
    type: String
  },
  Refference2MobileNumber: {
    type: String
  },
  Refference2Pincode: {
    type: String
  },


  // Other Details
  noOfDependentID: {
    type: String
  },
  emailID: {
    type: String
  },
  employmentType: {
    type: String
  },
  lastCTC: {
    type: String
  },
  inhand: {
    type: String
  },
  designation: {
    type: String
  },
  religion: {
    type: String
  },
  category: {
    type: String
  },
  physicalDisabled: {
    type: String
  },
  usrpwd: {
    type: String
  },
  dob: {
    type: Date
  },
  dob_datemilisecond: {
    type: Number
  },

  // Loan Requirment
  loanBankName: {
    type: String
  },
  loanType: {
    type: String
  },
  loanamount: {
    type: String
  },
  laonemi: {
    type: String
  },
  loantenure: {
    type: String
  },
  loanAccountNo: {
    type: String
  },
  startDate: {
    type: Date
  },
  startDate_datemilisecond: {
    type: Number
  },


  AadharNumber: {
    type: String
  },
  Area: {
    type: String
  },
  Address1: {
    type: String
  },
  CityName: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  StateName: {
    type: Schema.Types.ObjectId, ref: 'stateSchema',
  },
  ac_pincode: {
    type: String
  },
  GSTIN: {
    type: String
  },
  PartyType: {
    type: Schema.Types.ObjectId, ref: 'paTypeSchema',
  },
  CrLimit: {
    type: Number
  },
  ac_iecno: {
    type: String
  },
  ac_website: {
    type: String
  },
  ac_phoff: {
    type: String
  },
  ac_phres: {
    type: String
  },
  SalesDesignation: {
    type: Schema.Types.ObjectId, ref: 'designationSchema',
  },
  SalesMachineCode: {
    type: String
  },
  SalesReportingHead: {
    type: Schema.Types.ObjectId, ref: 'accountSchema',
  },
  MobileNo: {
    type: String
  },
  ac_phfax: {
    type: String
  },
  OpBalance: {
    type: Number
  },
  OpBalanceType: {
    type: String
  },
  dbcr: {
    type: String
  },
  account_ledgr: {
    type: Schema.Types.ObjectId, ref: 'accountSchema',
  },
  Address2: {
    type: String
  },
  Address3: {
    type: String
  },
  shipac_add1: {
    type: String
  },
  shipac_add2: {
    type: String
  },
  shipac_add3: {
    type: String
  },
  Remarks: {
    type: String
  },
  shipac_city: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  billac_phmob2: {
    type: String
  },
  CrDays: {
    type: String
  },
  jw_alias: {
    type: String
  },
  primarywarehouse: {
    type: Schema.Types.ObjectId, ref: 'subwarehouseMast',
  },
  entry: {
    type: String
  },
  update: {
    type: String
  },
  delete: {
    type: String
  },
  code: {
    type: String
  },
  ship_pinno: {
    type: String
  },
  ship_mobno: {
    type: String
  },
  shipoff_no: {
    type: String
  },
  shipres_no: {
    type: String
  },
  ship_mob2: {
    type: String
  },
  contno: {
    type: String
  },
  ac_bank: {
    type: [bank_group]
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
}, {
  collection: 'accountSchema'
});
module.exports = mongoose.model('accountSchema', accountSchema);