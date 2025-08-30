const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fuelSchema = new Schema({
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
  collection: 'fuelSchema'
});

module.exports = mongoose.model('fuelSchema', fuelSchema);