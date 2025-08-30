const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let visitorSchema = new Schema({
    main_bk: {
        type: String
    },
    date: {
        type: Date
    },
    date_milisecond: {
        type: Number
    },
    c_j_s_p: {
        type: String
    },
    vouc_code: {
        type: Number
    },
    mobile: {
        type: Number
    },
    name: {
        type: String
    },
    company: {
        type: String
    },
    want_to_meet: {
        type: Schema.Types.ObjectId, ref: 'attendantSchema',
    },
    time_in: {
        type: String
    },
    purpose: {
        type: String
    },
    auditers: {
        type: String
    },
    faceid: {
        type: String
    },
    imageid: {
    type: String
    },
      
    filepath: [{
        type: String,
    }],
    filename: [{
        type: String
    }],    
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
}, {
    collection: 'visitorSchema'
});

module.exports = mongoose.model('visitorSchema', visitorSchema);