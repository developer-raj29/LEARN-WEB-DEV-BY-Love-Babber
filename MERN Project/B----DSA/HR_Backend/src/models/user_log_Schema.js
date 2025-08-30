const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user_log_Schema = new Schema({
  
  user_name: {
    type: String
  },
  module_name: {
    type: String
  },
  user_op: {
    type: String
  },
  entry_id: {
    type: String
  },
  entry_date: {
    type: Date
  },
  entry_datemilisecond: {
    type: Number
  },

},{
    collection: 'user_log_Schema'
});

module.exports = mongoose.model('user_log_Schema', user_log_Schema);