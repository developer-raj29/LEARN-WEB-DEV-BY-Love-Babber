const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// let vouchArray = new Schema({ 
//   Vo_des: {
//     type: String
//   },
//   Vo_book: {
//     type: String
//   },
//   Vo_notyp: {
//     type: String
//   },
//   Vo_startNo: {
//     type: String
//   },
//   Vo_endNo: {
//     type: String
//   },
//   Vo_ReStartNo: {
//     type: String
//   },
//   Vo_Ldate: {
//     type: String
//   },
//   Vo_Active: {
//     type: String
//   },
//   Vo_Division: [{ type: Schema.Types.ObjectId, ref:'divSchema' }],
//   Vo_ItemList: {
//     type: String
//   },
//   Vo_CsCr: {
//     type: String
//   },
//   price  :  String ,
//  id : Schema.Types.ObjectId  });

let vouchSchema = new Schema({
  ModuleName: {
    type: String,
  },
  Module: {
    type: String,
  },
  Vo_des: {
    type: String
  },
  Vo_book: {
    type: String
  },
  Vo_notyp: {
    type: String
  },
  Vo_startNo: {
    type: String
  },
  Vo_endNo: {
    type: String
  },
  Vo_ReStartNo: {
    type: String
  },
  Vo_Ldate: {
    type: String
  },
  Vo_Active: {
    type: String
  },
  Vo_Division: [{ type: Schema.Types.ObjectId, ref:'divSchema' }],
  Vo_ItemList: {
    type: String
  },
  Vo_CsCr: {
    type: String
  },
  price  :  String ,
  user: {
    type: String
  },
  entrydate: {
    type: String
  },
  update: {
    type: String
  },
  masterid:{
    type: String
  },
  // vouchArray: {
  //   type: [vouchArray]
  // }
},{
    collection: 'vouchSchema'
});

module.exports = mongoose.model('vouchSchema', vouchSchema);