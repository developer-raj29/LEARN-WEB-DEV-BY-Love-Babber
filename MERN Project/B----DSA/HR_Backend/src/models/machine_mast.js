  const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var machgroup = new Schema({  
  shift: {
    type: Schema.Types.ObjectId, ref: 'shiftSchema'
  },
  category: {
    type: Schema.Types.ObjectId, ref: 'employeecategorySchema',
  },

  nos: Number,
  hours: Number,
    
  id: Schema.Types.ObjectId
});

let machineSchema = new Schema({
  machine_name: {
    type: String
  },
   department: {
    type: Schema.Types.ObjectId, ref: 'department_master_Schema',
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
  machgroup: [machgroup],
});

module.exports = mongoose.model('machineSchema', machineSchema);