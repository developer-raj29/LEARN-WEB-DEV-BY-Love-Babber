const request_schema = require('../models/request_schema.js');

const user_log = require('../models/user_log_Schema.js');
const resignSchema = require('../models/resignSchema.js');
const autho_log = require('../models/autho_log.js');
const autho_setup = require('../models/autho_setup.js');
const mongoose = require('mongoose'); // Import mongoose
const dailyatten_mast = require('../models/attenSchema.js');
const employeeschemas = require('../models/employeeSchema.js');

const moment = require('moment-timezone');
const { validationResult } = require('express-validator');

exports.MaxReqNo = async (req, res) => {
    try {
        const maxRequestNumber = await request_schema.aggregate([
            { $match: { module_name: "Loan Request" } }, // Filter by module_name
            { $group: { _id: null, maxRequestNumber: { $max: "$request_number" } } }
        ]);

        res.json({ maxRequestNumber: maxRequestNumber[0]?.maxRequestNumber || 0 });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.LoanReqAdd = async (req, res) => {
    try {
        let state_mast = new request_schema();
        state_mast.request_number = req.body.loanNumber;
        state_mast.request_date = moment(req.body.LoanDate).tz("Asia/Kolkata");
        state_mast.request_datemilisecond = moment(req.body.LoanDate).tz("Asia/Kolkata").format('x');
        state_mast.request_nos = req.body.SelectedDays;
        state_mast.status = "Pending";

        state_mast.employee_name = req.body.employeeName;
        state_mast.request_loan_purpose = req.body.LoanType;
        state_mast.request_fromdate = moment(req.body.FromDate).tz("Asia/Kolkata");
        state_mast.request_fromdatemilisecond = moment(req.body.FromDate).tz("Asia/Kolkata").format('x');

        state_mast.request_todate = moment(req.body.ToDate).tz("Asia/Kolkata");
        state_mast.request_todatemilisecond = moment(req.body.ToDate).tz("Asia/Kolkata").format('x');

        state_mast.leave_reason = req.body.Reason;
        state_mast.request_remarks = req.body.Remark;

        state_mast.request_amount = req.body.amount;
        state_mast.request_installment = req.body.Installment;
        state_mast.request_interest = req.body.Interest;

        state_mast.module_name = "Loan Request";

        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        var state_mast_entry = new Date();
        var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = entryDateObject.format('x');
        state_mast.entry = entryDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();

        const data = await autho_setup.findOne({ module_name: "Loan Request" });

        for (const item of data.rolesetup) {
            try {
                let autholog_mast = new autho_log();
                autholog_mast.module_name = "Loan Request";
                autholog_mast.approved = "No";
                autholog_mast.request_date = moment(req.body.leaveDate).tz("Asia/Kolkata");
                autholog_mast.request_datemilisecond = moment(req.body.leaveDate).tz("Asia/Kolkata").format('x');
                autholog_mast.usrnm = req.body.user;
                autholog_mast.co_code = req.body.compid;
                autholog_mast.div_code = req.body.divid;
                autholog_mast.requestuser_name = req.body.user;
                autholog_mast.role = item.role;
                autholog_mast.authouser_name = item.user;
                autholog_mast.sno = req.body.loanNumber;
                autholog_mast.leave_request = state_mast._id;
                await autholog_mast.save();

            } catch (error) {
                console.error('Error:', error);
            }
        }


        // let autholog_mast = new autho_log();

        // autholog_mast.module_name = "Leave Request";
        // autholog_mast.approved = "No";
        // autholog_mast.request_date = moment(req.body.leaveDate).tz("Asia/Kolkata");
        // autholog_mast.request_datemilisecond = moment(req.body.leaveDate).tz("Asia/Kolkata").format('x');
        // autholog_mast.usrnm = req.body.user;
        // autholog_mast.co_code = req.body.compid;
        // autholog_mast.div_code = req.body.divid;
        // autholog_mast.requestuser_name = req.body.user;
        // await autholog_mast.save();

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'request_schema';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Added successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.LoanReqListGET = async (req, res) => {
    try {
        console.log(req.query)
        const qry = { del: "N", module_name: "Loan Request",div_code: req.query.divid, co_code: req.query.compid };
        req.query.LeaveID && (qry._id = new mongoose.Types.ObjectId(req.query.LeaveID));
        req.query.emp && (qry.employee_name = new mongoose.Types.ObjectId(req.query.emp));

        const lastEntryNo = await request_schema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            {
                $lookup: {
                    from: 'resignSchema',
                    localField: 'leave_reason',
                    foreignField: '_id',
                    as: 'resignSchema'
                }
            },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'request_typ',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
            {
                $project: {
                    request_number: "$request_number",
                    request_date: "$request_date",
                    request_nos: "$request_nos",
                    // request_typ: "$request_typ",
                    request_remarks: "$request_remarks",
                    request_fromdate: "$request_fromdate",
                    request_todate: "$request_todate",
                    request_loan_purpose: "$request_loan_purpose",
                    request_amount: "$request_amount",
                    request_installment: "$request_installment",
                    request_interest: "$request_interest",
                    status: "$status",
                    request_typ: {
                        _id: { $arrayElemAt: ["$leaveSchema._id", 0] },
                        discription: { $arrayElemAt: ["$leaveSchema.discription", 0] }
                    },
                    leave_reason: {
                        _id: { $arrayElemAt: ["$resignSchema._id", 0] },
                        discription: { $arrayElemAt: ["$resignSchema.discription", 0] }
                    },
                    employee_name: {
                        _id: { $arrayElemAt: ["$employeeschemas._id", 0] },
                        full_name: { $arrayElemAt: ["$employeeschemas.full_name", 0] }
                    }
                }
            }
        ]);

        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LoanReqDELETE = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        var state_mast_entry = new Date();
        var deleteDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var deletedatemilisecond = deleteDateObject.format('x');

        let state_mast = {
            delete: deleteDateObject,
            delete_datemilisecond: deletedatemilisecond,
            del: 'Y'
        };

        await request_schema.updateOne({ _id: req.params.id }, state_mast);

        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'request_schema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Leave Request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LoanReqEdit = async (req, res) => {
    try {
        var loanid = req.body.EditID
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        let state_mast = {};
        state_mast.leave_reason = req.body.Reason;
        state_mast.request_remarks = req.body.Remark;
        state_mast.request_date = moment(req.body.LoanDate).tz("Asia/Kolkata");
        state_mast.request_datemilisecond = moment(req.body.LoanDate).tz("Asia/Kolkata").format('x');
        state_mast.employee_name = req.body.employeeName;
        state_mast.request_loan_purpose = req.body.LoanType;

        state_mast.request_amount = req.body.amount;
        state_mast.request_installment = req.body.Installment;
        state_mast.request_interest = req.body.Interest;

        state_mast.request_fromdate = moment(req.body.FromDate).tz("Asia/Kolkata");
        state_mast.request_fromdatemilisecond = moment(req.body.FromDate).tz("Asia/Kolkata").format('x');

        state_mast.request_todate = moment(req.body.ToDate).tz("Asia/Kolkata");
        state_mast.request_todatemilisecond = moment(req.body.ToDate).tz("Asia/Kolkata").format('x');

        state_mast.request_nos = req.body.SelectedDays;
        state_mast.user = req.body.user

        state_mast.update = userDateObject;
        state_mast.update_datemilisecond = entrydatemilisecond;

        let query = { _id: loanid }
        await request_schema.updateOne(query, state_mast,)

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'request_schema';
        userLog.user_op = 'U';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated Successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.test = async (req, res) => {
    try {
        const data = await request_schema.findById(req.body.reqid);

        const employee_name = data.employee_name;
        const qry = { _id: employee_name };
        const Empdata = await employeeschemas.findById(employee_name);

        // Ensure loangroup is an array
        const loanGroup = Empdata.loangroup || [];
        loanGroup.push({
            "loan_date": new Date(),
            "loan_datemilisecond": new Date().getTime(),
            "loanremarks": "Loan taken for home renovation",
            "loandc": "(+)",
            "loanamount": 50000,
            "loaninstallment": 2000,
            "loanbalance": 5000,
        });

        await employeeschemas.updateOne(qry, { $set: { loangroup: loanGroup } });

        const updatedEmpdata = await employeeschemas.findById(employee_name, 'loangroup');

        return res.json({ employee_name: updatedEmpdata });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

