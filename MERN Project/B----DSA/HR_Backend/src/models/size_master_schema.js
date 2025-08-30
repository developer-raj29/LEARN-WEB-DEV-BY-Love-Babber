const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var sizegroup = new Schema({
  fg_type: {
    type: Schema.Types.ObjectId, ref: 'fg_type_schema',
  },
  fg_catg: {
    type: Schema.Types.ObjectId, ref: 'fg_category_schema',
  },
  length: {
    type: String
  },
  width: {
    type: String
  },
  pcs: {
    type: String
  },
  mtrs: {
    type: String
  },
})

let size_schema = new Schema({
  Description: {
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
  },
  size_or_group: [sizegroup],
}, {
  collection: 'size_schema'
});

module.exports = mongoose.model('size_schema', size_schema);