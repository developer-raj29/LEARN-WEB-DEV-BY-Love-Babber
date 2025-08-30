const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let districtSchema = new Schema({
  DistrictName: {
    type: String
  },
  StateName: {
    type: Schema.Types.ObjectId, ref:'stateSchema',
  },
  Population: {
    type: Number
  },
  Area: {
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
    collection: 'districtSchema'
});

module.exports = mongoose.model('districtSchema', districtSchema);