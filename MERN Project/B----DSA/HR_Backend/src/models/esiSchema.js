const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let esiSchema = new Schema({
  discription: {
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
  collection: 'esiSchema'
});

module.exports = mongoose.model('esiSchema', esiSchema);