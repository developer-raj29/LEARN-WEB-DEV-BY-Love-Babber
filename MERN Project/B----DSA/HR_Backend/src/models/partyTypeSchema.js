const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let paTypeSchema = new Schema({
  Description: {
    type: String
  },
  Code: {
    type: String
  },
  sales_posting_ac:{
    type: Schema.Types.ObjectId, ref:'accountSchema',
  },
  pur_posting_ac:{
      type: Schema.Types.ObjectId, ref:'accountSchema',
  },
  SR_posting_ac:{
      type: Schema.Types.ObjectId, ref:'accountSchema',
  },
  PR_posting_ac:{
      type: Schema.Types.ObjectId, ref:'accountSchema',
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
    collection: 'paTypeSchema'
});

module.exports = mongoose.model('paTypeSchema', paTypeSchema);