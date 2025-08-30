const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let groupSetupSchema = new Schema({
  group: String,
  garry: [{ type: Schema.Types.ObjectId, ref: 'groupSchema' }],
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
    collection: 'groupSetupSchema'
  });

module.exports = mongoose.model('groupSetupSchema', groupSetupSchema);

