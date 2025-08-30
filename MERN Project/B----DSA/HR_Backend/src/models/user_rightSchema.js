let mongoose = require('mongoose');
var Schema = mongoose.Schema;

let userSchema = mongoose.Schema({
    usrnm: {
        type: String,
        required: true
    },
    usrpwd: {
        type: String,
    },
    emailid: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    phone_num: {
        type: String,
    },
    details: {
        type: String,
    },
    user_department: {
        type: [{ type: Schema.Types.ObjectId, ref: 'department_master_Schema' }]
    },
    user_deprt_order: {
        type: Array
    },
    sales_division: {
        type: [{ type: Schema.Types.ObjectId, ref: 'sales_division_schema' }]
    },
    fg_type_id: {
        type: [{ type: Schema.Types.ObjectId, ref: 'fg_type_schema' }]
    },
    admin: {
        type: String,
    },
    co_code: {
        type: [{ type: Schema.Types.ObjectId, ref: 'companySchema' }]
    },
    div_code: {
        type: [{ type: Schema.Types.ObjectId, ref: 'divSchema' }]
    },
    administrator: {
        type: String,
    },
    masterid: {
        type: Schema.Types.ObjectId, ref: 'masterSchema',
    }
}, {
    collection: 'userSchema'
});
module.exports = mongoose.model('userSchema', userSchema);