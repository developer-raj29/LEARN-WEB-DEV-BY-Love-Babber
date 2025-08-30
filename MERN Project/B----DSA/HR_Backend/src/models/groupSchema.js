const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let groupSchema = new Schema({
  Order: {
    type: Number
  },
  MainGroupName: {
    type: String
  },
  GroupName: {
    type: String
  },
  GroupType: {
    type: String
  },
  MaintainOs: {
    type: String
  },
  Suppress: {
    type: String
  },
  Address: {
    type: String
  },
  Ledger: {
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
    collection: 'groupSchema'
});

module.exports = mongoose.model('groupSchema', groupSchema);