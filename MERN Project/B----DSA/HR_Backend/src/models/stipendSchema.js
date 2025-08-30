const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let stipendSchema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  machine_code: {
    type: String
  },
  spouse: {
    type: String
  },
  father_name: {
    type: String
  },
  mother_name: {
    type: String
  },
  merital_status: {
    type: String
  },
  birth_date: {
    type: Date
  },
  birth_datemilisecond: {
    type: Number,
  },
  joining: {
    type: Date
  },
  joiningmilisecond: {
    type: Number,
  },
  category: {
    type: Schema.Types.ObjectId, ref:'employeecategorySchema',
  },
  resign_reason: {
    type: Schema.Types.ObjectId, ref:'resignSchema',
  },
  bank: {
    type: Schema.Types.ObjectId, ref:'bankSchema',
  },
  weekly_off: {
    type: String
  },
  bank_ac_no: {
    type: String
  },
  dispensory: {
    type: Schema.Types.ObjectId, ref:'esiSchema',
  },
  pan: {
    type: String
  },
  default_shift: {
    type: Schema.Types.ObjectId, ref:'shiftSchema',
  },
  structure: {
    type: Schema.Types.ObjectId, ref:'salarystruSchema',
  },
  gross_status: {
    type: String
  },
  days: {
    type: String
  },
  ot_app: {
    type: String
  },
  salary_mode: {
    type: String
  },
  esi_applicable1: {
    type: String
  },
  no1: {
    type: String
  },
  esi_applicable2: {
    type: String
  },
  no2: {
    type: String
  },
  application_division: {
    type: String
  },
  ward_circle: {
    type: String
  },
  remarks: {
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
    collection: 'stipendSchema'
});

module.exports = mongoose.model('stipendSchema', stipendSchema);