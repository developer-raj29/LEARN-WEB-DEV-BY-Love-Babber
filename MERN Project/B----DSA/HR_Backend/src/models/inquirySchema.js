const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var FollowUpGroup = new Schema({    

    FollowUpremarks: {
        type: String
    },
    discussion: {
        type: String
    },
    followDate: {
        type: Date
    },
    followDate_datemilisecond: {
        type: Number
    },
      
    id: Schema.Types.ObjectId
  });

let inquirySchema = new Schema({
    Inquryno: {
        type: String
    },
    customer: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    loanAmount: {
        type: String
    },
    exshowroomPrice: {
        type: String
    },
    cibilScore: {
        type: String
    },
    dealer: {
        type: Schema.Types.ObjectId, ref: 'accountSchema',
    },
    remarks: {
        type: String
    },
    vehicleNo: {
        type: String
    },
    make: {
        type: Schema.Types.ObjectId, ref: 'makeSchema',
    },
    model: {
        type: Schema.Types.ObjectId, ref: 'modelSchema',
    },
    variant: {
        type: Schema.Types.ObjectId, ref: 'variantSchema',
    },
    status: {
        type: String
    },
    date: {
        type: Date
    },
    date_datemilisecond: {
        type: Number
    },
    FollowUpremarks: {
        type: String
    },
    discussion: {
        type: String
    },
    followDate: {
        type: Date
    },
    followDate_datemilisecond: {
        type: Number
    },
    FollowUpGroup: [FollowUpGroup],
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
    collection: 'inquirySchema'
});

module.exports = mongoose.model('inquirySchema', inquirySchema);