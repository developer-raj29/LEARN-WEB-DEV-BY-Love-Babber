const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let leaveSchema = new Schema({
  discription: {
    type: String
  },
  code: {
    type: String
  },
  benifit_leave: {
    type: String
  },
  day_count: {
    type: String
  },
  yearly_nos: {
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
    collection: 'leaveSchema'
});

module.exports = mongoose.model('leaveSchema', leaveSchema);