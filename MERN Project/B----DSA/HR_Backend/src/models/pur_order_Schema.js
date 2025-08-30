let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ordergroup = new Schema({
    shipping_party_table: {
        type: Schema.Types.ObjectId, ref: "accountSchema",
    },
    order_id: {
        type: String
    },
    order_item_id: {
        type: String
    },
    brand: {
        type: Schema.Types.ObjectId, ref: 'brand_schema',
    },
    fg_type: {
        type: Schema.Types.ObjectId, ref: 'fg_type_schema',
    },
    size: {
        type: Schema.Types.ObjectId, ref: 'size_schema',
    },
    color: {
        type: Schema.Types.ObjectId, ref: 'color_schema',
    },
    fg_category: {
        type: Schema.Types.ObjectId, ref: 'fg_category_schema',
    },
    material_type: {
        type: Schema.Types.ObjectId, ref: 'raw_mat_typ_mast_Schema',
    },
    drop_length: {
        type: String
    },
    sku_id: {
        type: String
    },
    sku_prod_id: {
        type: Schema.Types.ObjectId, ref: 'productrawSchema',
    },
    sku_description: {
        type: String
    },
    description: {
        type: String
    },
    marks_from: {
        type: String
    },
    marks_to: {
        type: String
    },
    box_type: {
        type: String
    },
    dimension: {
        type: String
    },
    no_of_box: {
        type: String
    },
    per_box_qty: {
        type: String
    },
    quantity: {
        type: Number
    },
    wght_per_piece: {
        type: String
    },
    item_price: {
        type: Number
    },
    shipping_price: {
        type: Number
    },
    qty_blc: {
        type: Number
    },
    qty_exe: {
        type: Number
    },
    sku_unit: {
        type: Schema.Types.ObjectId, ref: 'skuSchema',
    },
    net_weight: {
        type: String
    },
    gross_weight: {
        type: String
    },
    price: {
        type: String
    },
    gst_per: {
        type: String
    },
    discount: {
        type: String
    },
    amount: {
        type: String
    },
    comments: {
        type: String
    },

})

var cuttinggroup = new Schema({
    product_name: {
        type: Schema.Types.ObjectId, ref: 'productrawSchema',
    },
    length: {
        type: String,
    },
    width: {
        type: String,
    },
    pcs: {
        type: String,
    },
    qty_mtrs: {
        type: String,
    },
    remark: {
        type: String,
    },

})

var addamt = new Schema({
    particular_add: String,
    particular_amount: Number,
    id: Schema.Types.ObjectId
});
var lessamt = new Schema({
    particular_less: String,
    particular_amtless: Number,
    id: Schema.Types.ObjectId
});

var mrngroup = new Schema({
    so_sno: Number,
    so_disc: {
        type: Schema.Types.ObjectId, ref: 'productrawSchema',
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'fgSchema',
    },
    model: {
        type: Schema.Types.ObjectId, ref: 'modelSchema',
    },
    so_fg_disc: {
        type: Schema.Types.ObjectId, ref: 'fgSchema',
    },
    brand: {
        type: Schema.Types.ObjectId, ref: 'brandSchema',
    },
    scheme: {
        type: Schema.Types.ObjectId, ref: 'scheme_setup_schemas',
    },
    outin_qty: Number,
    ocrate: Number,
    order_price: Number,
    price_one: Number,
    sku_unit: {
        type: Schema.Types.ObjectId, ref: 'skuSchema',
    },
    unit_one: {
        type: Schema.Types.ObjectId, ref: 'skuSchema',
    },
    sopacper_carten: Number,
    so_qty: Number,
    qty_one: Number,
    free_qty: Number,
    rate: Number,
    disc_per: Number,
    disc_rupee: Number,
    amount: Number,
    so_discount: Number,
    gst_rate: Number,
    so_qty_exe: Number,
    so_qty_blc: Number,
    po_qty_exe: Number,
    po_qty_blc: Number,
    total_amt: Number,
    total_amt_before: Number,
    sd2id: String,
    sd2srno: String,
    pendqty: Number,
    qty_bal: Number,
    qty_exe: Number,
    id: Schema.Types.ObjectId
});

let pur_order_Schema = mongoose.Schema({
    //order booking entry
    main_bk: {
        type: String
    },
    order_no: {
        type: String
    },
    tracking_number: {
        type: String
    },
    vouc_code: {
        type: Number
    },
    order_rn_no: {
        type: String
    },
    order_date: {
        type: Date
    },
    order_datemilisecond: {
        type: Number
    },
    shipped_date: {
        type: Date
    },
    shipped_datemilisecond: {
        type: Number
    },
    payments_date: {
        type: Date
    },
    payments_datemilisecond: {
        type: Number
    },
    buyer_email: {
        type: String
    },
    customer: {
        type: Schema.Types.ObjectId, ref: "accountSchema"
    },
    buyer_phone_number: {
        type: String
    },
    sku: {
        type: String
    },
    p_order_no: {
        type: String
    },
    p_order_date: {
        type: Date
    },
    p_order_datemilisecond: {
        type: Number
    },
    online_portal_code: {
        type: String
    },
    payment_term: {
        type: String
    },
    deliverydate: {
        type: Date
    },
    delivery_datemilisecond: {
        type: Number
    },
    freight: {
        type: String
    },
    packing: {
        type: String
    },
    online_portal: {
        type: Schema.Types.ObjectId, ref: "onlineportal_schema"
    },
    symbol: {
        type: Schema.Types.ObjectId, ref: "currency_schema"
    },
    port_of_loading: {
        type: String
    },
    port_of_destination: {
        type: String
    },
    final_place_of_delivery: {
        type: String
    },
    incoterm: {
        type: String
    },
    fba_id: {
        type: String
    },
    amazon_reference_id_po: {
        type: String
    },
    tot_no_box: {
        type: Number
    },
    tot_qty: {
        type: Number
    },
    tot_net_wt: {
        type: Number
    },
    tot_gross_wt: {
        type: Number
    },
    tot_amt: {
        type: Number
    },
    order_notes: {
        type: String
    },
    source: {
        type: String
    },
    order_status: {
        type: String
    },
    item_price: {
        type: Number
    },
    item_tax: {
        type: Number
    },
    shipping_price: {
        type: Number
    },
    shipping_tax: {
        type: Number
    },
    ship_service_level: {
        type: String
    },
    shipping_party: {
        type: Schema.Types.ObjectId, ref: "accountSchema"
    },
    currency: {
        type: String
    },
    // shipping_tax: {
    //     type: String
    // },
    ship_service_level: {
        type: String
    },
    order_status: {
        type: String
    },
    // item_price: {
    //     type: String
    // },
    // item_tax: {
    //     type: String
    // },
    // shipping_price: {
    //     type: String
    // },
    ship_service_level: {
        type: String
    },
    address: {
        type: String
    },
    ship_address_1: {
        type: String
    },
    ship_address_2: {
        type: String
    },
    ship_address_3: {
        type: String
    },
    ship_city: {
        type: Schema.Types.ObjectId, ref: "citySchema"
    },
    ship_state: {
        type: Schema.Types.ObjectId, ref: "stateSchema"
    },
    ship_postal_code: {
        type: String
    },
    ship_country: {
        type: Schema.Types.ObjectId, ref: "country_master_Schema"
    },
    ship_phone_number: {
        type: String
    },
    item_pro_id: {
        type: String
    },
    item_pro_dis: {
        type: String
    },
    ship_pro_id: {
        type: String
    },
    ship_pro_dis: {
        type: String
    },

    deli_sdate: {
        type: String
    },
    deli_edate: {
        type: String
    },
    deli_tzone: {
        type: String
    },
    deli_ins: {
        type: String
    },
    sales_channel: {
        type: String
    },
    is_busin_order: {
        type: String
    },
    pur_order_no: {
        type: String
    },
    price_design: {
        type: String
    },
    cus_url: {
        type: String
    },
    cus_page: {
        type: String
    },
    // zip: {
    //     type: String
    // },
    trans_date: {
        type: Date
    },
    trans_datemilisecond: {
        type: Number
    },


    remark_1: {
        type: String
    },
    employee_name_1: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_1: {
        type: Date
    },
    datemilisecond_1: {
        type: Number
    },
    time_1: {
        type: String
    },
    dept_order_1: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_1: {
        type: String
    },


    remark_2: {
        type: String
    },
    employee_name_2: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_2: {
        type: Date
    },
    datemilisecond_2: {
        type: Number
    },
    time_2: {
        type: String
    },
    dept_order_2: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_2: {
        type: String
    },


    remark_3: {
        type: String
    },
    employee_name_3: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_3: {
        type: Date
    },
    datemilisecond_3: {
        type: Number
    },
    time_3: {
        type: String
    },
    dept_order_3: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_3: {
        type: String
    },


    remark_4: {
        type: String
    },
    employee_name_4: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_4: {
        type: Date
    },
    datemilisecond_4: {
        type: Number
    },
    time_4: {
        type: String
    },
    dept_order_4: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_4: {
        type: String
    },


    remark_5: {
        type: String
    },
    employee_name_5: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_5: {
        type: Date
    },
    datemilisecond_5: {
        type: Number
    },
    time_5: {
        type: String
    },
    dept_order_5: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_5: {
        type: String
    },

    remark_6: {
        type: String
    },
    employee_name_6: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_6: {
        type: Date
    },
    datemilisecond_6: {
        type: Number
    },
    time_6: {
        type: String
    },
    dept_order_6: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_6: {
        type: String
    },

    remark_7: {
        type: String
    },
    employee_name_7: {
        type: Schema.Types.ObjectId, ref: "employeeschemas"
    },
    date_7: {
        type: Date
    },
    datemilisecond_7: {
        type: Number
    },
    time_6: {
        type: String
    },
    dept_order_7: {
        type: Schema.Types.ObjectId, ref: "department_master_Schema"
    },
    user_name_7: {
        type: String
    },

    //RETURN
    Ret_Orderid: {
        type: String
    },
    Ret_returnDate: {
        type: Date
    },
    Ret_returnDatemilisecond: {
        type: Number
    },
    Ret_SKU: {
        type: String
    },
    Ret_ASIN: {
        type: String
    },
    Ret_fnSKU: {
        type: String
    },
    Ret_Productnm: {
        type: String
    },
    Ret_Qty: {
        type: Number
    },
    Ret_fulfill_Centerid: {
        type: String
    },
    Ret_detail_dispo: {
        type: String
    },
    Ret_Reasn: {
        type: String
    },
    Ret_Status: {
        type: String
    },
    Ret_Licn_PlateNo: {
        type: String
    },
    Ret_Custm_Commt: {
        type: String
    },

    //transaction
    Trns_datetime: {
        type: String
    },
    Trns_settlmentid: {
        type: Number
    },
    Trns_type: {
        type: String
    },
    Trns_orderid: {
        type: String
    },
    Trns_SKU: {
        type: String
    },
    Trns_description: {
        type: String
    },
    Trns_qty: {
        type: Number
    },
    Trns_marketplce: {
        type: String
    },
    Trns_accounttype: {
        type: String
    },
    Trns_fulfillment: {
        type: String
    },
    Trns_ordercity: {
        type: String
    },
    Trns_orderstate: {
        type: String
    },
    Trns_orderportal: {
        type: String
    },
    Trns_tax_collectionmodel: {
        type: String
    },
    Trns_productsale: {
        type: Number
    },
    Trns_productsaletax: {
        type: Number
    },
    Trns_shipp_cred: {
        type: Number
    },
    Trns_shipp_credtax: {
        type: Number
    },
    Trns_giftwrapcred: {
        type: Number
    },
    Trns_giftwarp_credtax: {
        type: Number
    },
    Trns_regultryfee: {
        type: Number
    },
    Trns_tx_regultryfee: {
        type: Number
    },
    Trns_prmo_rebt: {
        type: Number
    },
    Trns_prmo_rebatestax: {
        type: Number
    },
    Trns_mrktplc_widtx: {
        type: Number
    },
    Trns_sellingfees: {
        type: Number
    },
    Trns_fba_fees: {
        type: Number
    },
    Trns_other_trnsctinfees: {
        type: Number
    },
    Trns_other: {
        type: Number
    },
    Trns_total: {
        type: Number
    },

    //reim  
    Reim_approval_date: {
        type: Date
    },
    Reim_approval_datemilisecond: {
        type: Number
    },
    Reim_reimbus_id: {
        type: Number
    },
    Reim_amzn_orderid: {
        type: String
    },
    Reim_caseid: {
        type: Number
    },

    Reim_reason: {
        type: String
    },
    Reim_SKU: {
        type: String
    },
    Reim_fnsku: {
        type: String
    },
    Reim_ASIN: {
        type: String
    },
    Reim_productnm: {
        type: String
    },
    Reim_condition: {
        type: String
    },
    Reim_currencyunit: {
        type: String
    },
    Reim_amtperunit: {
        type: Number
    },
    Reim_amounttot: {
        type: Number
    },
    Reim_reim_qty_reimcash: {
        type: Number
    },
    Reim_reim_inventry: {
        type: Number
    },
    Reim_reim_total: {
        type: Number
    },
    Reim_reimid: {
        type: Number
    },
    Reim_org_reimtype: {
        type: String
    },







    //code for dispatch
    courier_name: {
        type: String
    },
    docket_no: {
        type: String
    },
    tracking_link: {
        type: String
    },
    dispatch_remark: {
        type: String,
    },

    //code for hold
    hold: {
        type: String
    },
    hold_date: {
        type: Date
    },
    hold_datemilisecond: {
        type: Number
    },
    hold_user: {
        type: String
    },

    //code for cancel
    cancel: {
        type: String
    },
    cancel_date: {
        type: Date
    },
    cancel_datemilisecond: {
        type: Number
    },
    cancel_user: {
        type: String
    },

    //purchase order
    d_c: {
        type: String,
    },
    so_no: {
        type: String,
    },
    vouc_code: {
        type: Number,
    },
    so_date: {
        type: Date,
    },
    so_datemilisecond: {
        type: Number,
    },
    buy_cus_name:
    {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    buy_rmks: {
        type: String,
    },
    buy_pono: {
        type: String,
    },
    buy_podt: {
        type: Date,
    },
    buy_podtmilisecond: {
        type: Number,
    },
    tot_amtbefore: {
        type: Number,
    },
    tot_sooq: {
        type: Number,
    },
    tot_discount: {
        type: Number,
    },
    tot_amtso: {
        type: Number,
    },
    grand_total: {
        type: Number,
    },
    so_remarks: {
        type: String,
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
    sales_or_group: [mrngroup],
    add_details: [addamt],
    less_details: [lessamt],
    order_group: [ordergroup],
    cutting_group: [cuttinggroup],
});

module.exports = mongoose.model('pur_order_Schema', pur_order_Schema);


