const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let stateSchema = new Schema({
  StateName: {
    type: String
  },
  StateCapital: {
    type: String
  },
  StateCode: {
    type: String
  },
  StateCodeName : {
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
    collection: 'stateSchema'
});

module.exports = mongoose.model('stateSchema', stateSchema);