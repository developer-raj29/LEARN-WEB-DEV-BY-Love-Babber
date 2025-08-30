const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let country_master_Schema = new Schema({
  countryName: {
    type: String
  },
  countryCode: {
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
  }
}, {
  collection: 'country_master_Schema'
});

module.exports = mongoose.model('country_master_Schema', country_master_Schema);