const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let accountSetupSchema = new Schema({
  group: String,
  garry: {type: Schema.Types.ObjectId, ref: 'accountSchema'},
  user: {
    type: String
  },
  update: {
    type: Date
  },
  update_datemilisecond: {
    type: Number
  },
  },{
    collection: 'accountSetupSchema'
  });

module.exports = mongoose.model('accountSetupSchema', accountSetupSchema);

