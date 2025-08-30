const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let bankSchema = new Schema({
  bankName: {
    type: String
  },
  noOfVehicleLimit: {
    type: String
  },
  companyName: {
    type: Schema.Types.ObjectId, ref: 'divSchema',
  },
  bankBranch: {
    type: String
  },
  gstNo: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: Schema.Types.ObjectId, ref: 'citySchema',
  },
  contactDetails: {
    type: String
  },
  limit: {
    type: String
  },
  percent: {
    type: String
  },
  payoutAccount: {
    type: Schema.Types.ObjectId, ref: 'accountSchema',
  },
  limitAccount: {
    type: Schema.Types.ObjectId, ref: 'accountSchema',
  },
  mail: {
    type: String
  },
  cc: {
    type: String
  },
  bcc: {
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
  }
},{
    collection: 'bankSchema'
});

module.exports = mongoose.model('bankSchema', bankSchema);