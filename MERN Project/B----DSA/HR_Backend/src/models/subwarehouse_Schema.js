const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Subwarehouse = new Schema({
  subwarehose_name: {
    type: String
  },
  location: {
    type: Schema.Types.ObjectId, ref:'citySchema',
  },
  whgroup: {
    type: Schema.Types.ObjectId, ref:'warehouseGroupmast',
  },
  area: {
    type: String
  },
  address: {
    type: String
  },
  warehouseDefault: {
    type: String
  },
  co_code: {
    type: String,
  },
  div_code: {
    type: String,
  },
  user: {
    type: String,
  },
  masterid: {
    type: String,
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
  collection: 'subwarehouseMast'
});

module.exports = mongoose.model('subwarehouseMast', Subwarehouse);