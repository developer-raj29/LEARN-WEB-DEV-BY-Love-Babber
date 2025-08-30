const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let gradeSchema = new Schema({
    GradeName: {
        type: String
    },
    GradeCode: {
        type: String
    },
    two_wheeler: {
        type: String
    },
    three_wheeler: {
        type: String
    },
    four_wheeler: {
        type: String
    },
    up_country: {
        type: String
    },
    out_station: {
        type: String
    },
    lodging_a: {
        type: String
    },
    lodging_b: {
        type: String
    },
    entry: {
        type: String
    },
    update: {
        type: String
    },
    delete: {
        type: String
    },
    del: {
        type: String
    },
    masterid: {
        type: String,
    },
}, {
    collection: 'gradeSchema'
});

module.exports = mongoose.model('gradeSchema', gradeSchema);