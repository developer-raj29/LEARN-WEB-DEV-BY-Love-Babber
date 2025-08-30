const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let productfgroup = new Schema({
  product_name: {
    type: Schema.Types.ObjectId, ref: 'productrawSchema',
  },
  qty: {
    type: Number
  },
  fiforate: {
    type: Number
  },
  amount: {
    type: Number
  },
  id: Schema.Types.ObjectId
});
let sizegroup = new Schema({
  size1: {
    type: Number
  },
  size2: {
    type: Number
  },
  pcs: {
    type: Number
  },
  cons: {
    type: Number
  },
  consumed: {
    type: Number
  },
  id: Schema.Types.ObjectId
});

let productinputroup = new Schema({
  input_name: {
    type: Schema.Types.ObjectId, ref: 'productrawSchema',
  },
  size1: {
    type: Number
  },
  size2: {
    type: Number
  },
  pcs: {
    type: Number
  },
  cons: {
    type: Number
  },
  consumed_formula: {
    type: Number
  },
  unit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  fiforate: {
    type: Number
  },
  actlamont: {
    type: Number
  },
  consumedformulacal: {
    type: Number
  },
  size_group: [sizegroup],
  id: Schema.Types.ObjectId
});
////ecommerse group
let mappingroup = new Schema({
  party_name: {
    type: String
  },
  portal_name: {
    type: Schema.Types.ObjectId, ref: 'onlineportalmast',
  },
  product_link: {
    type: String
  },
  id: Schema.Types.ObjectId
});
///ecommerse group
let debtoraliasgroup = new Schema({
  ledger_name: {
    type: Schema.Types.ObjectId, ref: 'accountSchema',
  },
  debtor_code: {
    type: String
  },
  rates: {
    type: String
  },
  sku_alias: {
    type: String
  },
  id: Schema.Types.ObjectId
});
////end
/////qualty check parameter
let qualtyggoup = new Schema({
  Attribute: {
    type: Schema.Types.ObjectId, ref: 'attributeSchema',
  },
  qualitity_param: {
    type: String
  },
  id: Schema.Types.ObjectId
});
////end
let productrawSchema = new Schema({
  //fgmaster
  fg_product_group: [productfgroup],
  fg_inputgroup: [productinputroup],
  qualty_checkgroup: [qualtyggoup],
  brand: {
    type: Schema.Types.ObjectId, ref: 'brand_schema',
  },
  fgType: {
    type: Schema.Types.ObjectId, ref: 'fg_type_schema',
  },
  fgCategory: {
    type: Schema.Types.ObjectId, ref: 'fg_category_schema',
  },
  unit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  property1: {
    type: String,
  },
  pattern: {
    type: String,
  },
  size: {
    type: String
  },
  color: {
    type: Schema.Types.ObjectId, ref: 'color_schema',
  },
  skuid: {
    type: String,
  },
  skualias: {
    type: String,
  },
  standerdcost: {
    type: String,
  },
  standardsalesprice: {
    type: String,
  },
  gst: {
    type: String
  },
  quality_check: {
    type: String,
  },
  qualitity_param: [{
    type: String,
  }],
  allocated_tags: [{
    type: Schema.Types.ObjectId, ref: 'TagmastSchema'
  }],
  fgprdt_standrdcost: {
    type: Number,
  },
  materialcost_totamt: {
    type: Number,
  },
  jobcost_per: {
    type: Number,
  },
  totstandrdcost: {
    type: Number,
  },
  roundoff: {
    type: Number,
  },
  packing_expence: {
    type: Number,
  },
  //end fgmaster
  ///ecommarce master
  product_title: {
    type: String,
  },
  product_sizel: {
    type: String,
  },
  product_sizew: {
    type: String,
  },
  product_sizeh: {
    type: String,
  },
  packing_sizel: {
    type: String,
  },
  packing_sizew: {
    type: String,
  },
  packing_sizeh: {
    type: String,
  },
  product_weight: {
    type: String,
  },
  product_unit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  pack_weight: {
    type: String,
  },
  pack_unit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  materialnm: {
    type: String,
    //type: Schema.Types.ObjectId, ref:'productrawSchema',
  },
  online_price: {
    type: String,
  },
  imagelink_group: {
    type: Array,
  },
  bullet_group: {
    type: Array,
  },
  debtoralias_group: [debtoraliasgroup],
  onlinemapping_group: [mappingroup],

  ///end ecommerce master
  main_bk: {
    type: String
  },
  vouchcode: {
    type: Number
  },
  rmgroupnm: {
    type: Schema.Types.ObjectId, ref: 'proTypeSchema',
  },
  rmctgnm: {
    type: Schema.Types.ObjectId, ref: 'CategorySchema',
  },
  rmatypnm: {
    type: Schema.Types.ObjectId, ref: 'raw_mat_typ_mast_Schema',
  },
  rmquality: {
    type: Schema.Types.ObjectId, ref: 'qualitySchema',
  },
  printorplain: {
    type: String
  },
  rmsubquality: {
    type: Schema.Types.ObjectId, ref: 'subqualitySchema',
  },
  additionalid: {
    type: String
  },
  stockname: {
    type: String
  },
  standardunit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  stndrdunitconversion: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  stndrdunitSign: {
    type: String
  },
  stndrdunitKg: {
    type: String
  },
  packingunit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  packingunitconvrson: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  packingunitSign: {
    type: String
  },
  packingunitKg: {
    type: String
  },
  purchaseunit: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  purchaseconvrson: {
    type: Schema.Types.ObjectId, ref: 'skuSchema',
  },
  purchseunitSign: {
    type: String
  },
  purchseunitKg: {
    type: String
  },
  consuptionbom: {
    type: String
  },
  lotNo: {
    type: String
  },
  hsncode: {
    type: String
  },
  gst: {
    type: String
  },
  rate: {
    type: String
  },
  // defaultvender: {
  //   type: Schema.Types.ObjectId, ref: 'accountSchema',
  // },
  suplierdes: {
    type: String
  },
  qc: {
    type: String
  },
  qc_group: {
    type: Array
  },
  std_cost: {
    type: String
  },
  code: {
    type: String
  },
  usrnm: {
    type: String,
  },
  masterid: {
    type: String,
  },
  co_code: {
    type: String,
  },
  div_code: {
    type: String,
  },
  update: {
    type: String
  },
  update_datemilisecond: {
    type: Number
  },
  entry: {
    type: Date
  },
  entry_datemilisecond: {
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
  ////stock module
  minStkQty: {
    type: String,
  },
  reOrderQty: {
    type: String,
  },
  maxStkQty: {
    type: String,
  },
  masterPack: {
    type: String,
  },
  mrnid: {
    type: Schema.Types.ObjectId, ref: 'mrn_Schema',
  },

}, {
  collection: 'productrawSchema'
});

module.exports = mongoose.model('productrawSchema', productrawSchema);