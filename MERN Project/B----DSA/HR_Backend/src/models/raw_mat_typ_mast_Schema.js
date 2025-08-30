const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let raw_mat_typ_mast_Schema = new Schema({
  Description: {
    type: String
  },
  Code: {
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
  collection: 'raw_mat_typ_mast_Schema'
});

module.exports = mongoose.model('raw_mat_typ_mast_Schema', raw_mat_typ_mast_Schema);