const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let citySchema = new Schema({
  CityName: {
    type: String
  },
  StateName: {
    type: Schema.Types.ObjectId, ref: 'stateSchema',
  },
  CityPinCode: {
    type: String
  },
  StdCode: {
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
}, {
  collection: 'citySchema'
});

module.exports = mongoose.model('citySchema', citySchema);