const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let shiftSchema = new Schema({
  shift_name: {
    type: String
  },
  in_time: {
    type: String
  },
  out_time: {
    type: String
  },
  total_hour: {
    type: Number
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
    collection: 'shiftSchema'
});

module.exports = mongoose.model('shiftSchema', shiftSchema);