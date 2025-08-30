const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fg_category_schema = new Schema({
  Description: {
    type: String
  },
  Code: {
    type: String
  },
  hsn:{
    type: String
  },
  gst:{
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
  collection: 'fg_category_schema'
});

module.exports = mongoose.model('fg_category_schema', fg_category_schema);