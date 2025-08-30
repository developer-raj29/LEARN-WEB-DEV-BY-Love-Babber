const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let expenseSchema = new Schema({
    HeadName: {
    type: String
  },
  DueDate: {
    type: String
  },
  type: {
    type: String
  },
  GroupName: {
    type: Schema.Types.ObjectId, ref: 'groupSchema',
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
  collection: 'expenseSchema'
});

module.exports = mongoose.model('expenseSchema', expenseSchema);