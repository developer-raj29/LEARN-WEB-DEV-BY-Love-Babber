const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let holidaySchema = new Schema({
  holiday_name: {
    type: String
  },
  shift_name: {
    type: String
  },
  date: {
    type: Date
  },
  in_time: {
    type: String
  },
  out_time: {                                     
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
},{
    collection: 'holidaySchema'
});

module.exports = mongoose.model('holidaySchema', holidaySchema);