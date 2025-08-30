const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let wareGroup = new Schema({
  whgrp_name: {
  type: String
},
whundergrp_nm: {
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
    collection: 'warehouseGroupmast'
});

module.exports = mongoose.model('warehouseGroupmast', wareGroup);