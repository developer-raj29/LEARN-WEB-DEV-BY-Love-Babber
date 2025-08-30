const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let vouchArray = new Schema({
    description: {
        type: String
    },
    book: {
        type: String
    },
    noType: {
        type: String
    },
    startNo: {
        type: String
    },
    EndNo: {
        type: String
    },
    Restart: {
        type: String
    },
    Ldate: {
        type: Date
    },
    active: {
        type: String
    },
    division: [{ type: Schema.Types.ObjectId, ref:'divSchema' }],
    Items: {
        type: String
    },
    d_c: {
        type: String
    },
    id: Schema.Types.ObjectId
});

let VoucherSetupSchema = new Schema({
  group: String,
  garry: {type: [vouchArray]},
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
    collection: 'VoucherSetupSchema'
  });

module.exports = mongoose.model('VoucherSetupSchema', VoucherSetupSchema);

