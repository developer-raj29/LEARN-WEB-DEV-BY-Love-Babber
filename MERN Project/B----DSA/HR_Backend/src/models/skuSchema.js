const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Product
let skuSchema = new Schema({
  SKUName:{
    type: String
  },
  SKUSymbol: {
    type: String
  },
  NoOfDecimal: {
    type: String
  },
  co_code:{
    type:String,
  },
  div_code:{
    type:String,
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
    collection: 'skuSchema'
});

module.exports = mongoose.model('skuSchema', skuSchema);