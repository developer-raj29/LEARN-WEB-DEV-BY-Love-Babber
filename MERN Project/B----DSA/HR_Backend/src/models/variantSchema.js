const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let variantSchema = new Schema({
    Description: {
    type: String
  },
  Code: {
    type: String
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
}, {
  collection: 'variantSchema'
});

module.exports = mongoose.model('variantSchema', variantSchema);