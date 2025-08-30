const DivSchema = require('../models/divSchema.js');
const Company = require('../models/company.model.js');
const groupSchema = require('../models/groupSchema.js');
const stateSchema = require('../models/stateSchema.js');
const citySchema = require('../models/citySchema.js');
const maintenanceSchema = require('../models/maintenanceSchema.js');
const makeSchema = require('../models/makeSchema.js');
const variantSchema = require('../models/variantSchema.js');
const modelSchema = require('../models/modelSchema.js');
const fuelSchema = require('../models/fuelSchema.js');
const documentSchema = require('../models/documentSchema.js');
const CustomerCategorySchema = require('../models/CustomerCategorySchema.js');
const CustomerTypeSchema = require('../models/CustomerTypeSchema.js');
const bankSchema = require('../models/bankSchema.js');
const accountSchema = require('../models/accountSchema.js');
const transSchema = require('../models/transSchema.js');
const group_setup_schema = require('../models/group_setup_schema.js');
const CustomerApplicationSchema = require('../models/CustomerApplicationSchema.js');
const accountSetupSchema = require('../models/accountSetupSchema.js');
const inquirySchema = require('../models/inquirySchema.js');
const expenseSchema = require('../models/expenseSchema.js');
const voucerMasterSchema = require('../models/voucerMasterSchema.js');
const voucher_setup_schema = require('../models/voucher_setup_schema.js');
const User = require('../models/user.model.js');


const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Company Master
exports.CompanyTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid }
        console.log(qry)
        const lastEntryNo = await DivSchema.aggregate([
            { $match: qry },
            { $project: { div_mast: "$div_mast" } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Group Master

exports.GroupMaster_Add = async (req, res) => {
    try {
        let state_mast = new groupSchema();
        state_mast.Order = req.body.order;
        state_mast.MainGroupName = req.body.mainGroupName;
        state_mast.GroupName = req.body.groupName;
        state_mast.GroupType = req.body.groupType;
        state_mast.MaintainOs = req.body.maintainOs;
        state_mast.Suppress = req.body.suppress;
        state_mast.Address = req.body.address;
        state_mast.Ledger = req.body.ledger;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await groupSchema.findOne({ GroupName: req.body.groupName, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Group Name" });
            }

            const newState = {
                Order: req.body.order,
                MainGroupName: req.body.mainGroupName,
                GroupName: req.body.groupName,
                GroupType: req.body.groupType,
                MaintainOs: req.body.maintainOs,
                Suppress: req.body.suppress,
                Address: req.body.address,
                Ledger: req.body.ledger,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await groupSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'groupSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await groupSchema.findOne({ GroupName: req.body.groupName, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Group Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'groupSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.GroupMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Order: "$Order", MainGroupName: "$MainGroupName", GroupName: "$GroupName", GroupType: "$GroupType", MaintainOs: "$MaintainOs", Suppress: "$Suppress", Address: "$Address", Ledger: "$Ledger" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GroupMasterTypesGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 0 } }
        ]);

        // Extract GroupName into an array
        const groupNames = result.map(item => item.GroupName);
        const totalCount = groupNames.length;

        res.json({ totalCount, groupNames });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GroupMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await groupSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'groupSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting designation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GroupMasterTypesWithIDGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        // Extract GroupName into an array
        const totalCount = result.length;

        res.json({ totalCount, groupNames: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// State Master
exports.StateMaster_Add = async (req, res) => {
    try {
        let state_mast = new stateSchema();
        state_mast.StateName = req.body.StateName;
        state_mast.StateCapital = req.body.StateCapital;
        state_mast.StateCode = req.body.StateCode;
        state_mast.StateCodeName = req.body.StateCodeName;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await stateSchema.findOne({ StateName: req.body.StateName, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate State Name" });
            }

            const newState = {
                StateName: req.body.StateName,
                StateCapital: req.body.StateCapital,
                StateCode: req.body.StateCode,
                StateCodeName: req.body.StateCodeName,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await stateSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'stateSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await stateSchema.findOne({ StateName: req.body.StateName, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate State Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'stateSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ImportState = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])

                if (step[s] != undefined && step[s]['State Name'] != undefined) var StateName = step[s]['State Name'];
                else var StateName = "";
                if (step[s] != undefined && step[s]['State Capital'] != undefined) var StateCapital = step[s]['State Capital'];
                else var StateCapital = "";
                if (step[s] != undefined && step[s]['State Code'] != undefined) var StateCode = step[s]['State Code'];
                else var StateCode = "";
                if (step[s] != undefined && step[s]['State Code Name'] != undefined) var StateCodeName = step[s]['State Code Name'];
                else var StateCodeName = "";
                var employeemaster = await stateSchema.findOne({ StateName: StateName, masterid: req.body.masterid })

                if (employeemaster && employeemaster._id.toString() !== req.body._id && employeemaster.del === 'N') {
                    console.log("Duplicate State Name", StateName);
                }
                else {
                    let state_mast = new stateSchema();
                    state_mast.StateName = StateName;
                    state_mast.StateCapital = StateCapital;
                    state_mast.StateCode = StateCode;
                    state_mast.StateCodeName = StateCodeName;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.entry = userDateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';

                    await state_mast.save();
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'stateSchema';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save();
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.StateMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await stateSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { StateName: "$StateName", StateCapital: "$StateCapital", StateCode: "$StateCode", StateCodeName: "$StateCodeName" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.StateMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    console.log(req.params.id);
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await stateSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'stateSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting State:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.StateTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await stateSchema.aggregate([
            { $match: qry },
            { $project: { StateName: "$StateName", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// City Master
exports.CityMaster_Add = async (req, res) => {
    try {
        let state_mast = new citySchema();
        state_mast.CityName = req.body.CityName;
        state_mast.StateName = req.body.StateName;
        state_mast.CityPinCode = req.body.CityPinCode;
        state_mast.StdCode = req.body.StdCode;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await citySchema.findOne({ CityName: req.body.CityName, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate City Name" });
            }

            const newState = {
                CityName: req.body.CityName,
                StateName: req.body.StateName,
                CityPinCode: req.body.CityPinCode,
                StdCode: req.body.StdCode,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await citySchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'citySchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await citySchema.findOne({ CityName: req.body.CityName, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate City Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'citySchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ImportCity = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])

                if (step[s] != undefined && step[s]['City Pin Code'] != undefined) var CityPinCode = step[s]['City Pin Code'];
                else var CityPinCode = "";
                if (step[s] != undefined && step[s]['Std Code'] != undefined) var StdCode = step[s]['Std Code'];
                else var StdCode = "";
                if (step[s] != undefined && step[s]['City Name'] != undefined) var CityName = step[s]['City Name'];
                else var CityName = "";
                if (step[s] != undefined && step[s]['State Name'] != undefined) var StateName = step[s]['State Name'];
                else var StateName = "";
                var employeemaster = await citySchema.findOne({ CityName: CityName, masterid: req.body.masterid })

                if (employeemaster && employeemaster._id.toString() !== req.body._id && employeemaster.del === 'N') {
                    console.log("Duplicate City Name", CityName);
                }
                let StateNameData;
                if (StateName) {
                    StateNameData = await stateSchema.findOne({ StateName: StateName, masterid: req.body.masterid })
                }
                let state_mast = new citySchema();
                state_mast.CityName = CityName;
                state_mast.StateName = StateNameData?._id;
                state_mast.CityPinCode = CityPinCode;
                state_mast.StdCode = StdCode;

                var userLog_entry = new Date();
                var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var entrydatemilisecond = userDateObject.format('x');
                state_mast.user = req.body.user;
                state_mast.masterid = req.body.masterid;
                state_mast.entry = userDateObject;
                state_mast.entry_datemilisecond = entrydatemilisecond;
                state_mast.del = 'N';

                await state_mast.save();
                var userLog = new user_log;
                userLog.user_name = req.body.user;
                userLog.module_name = 'citySchema';
                userLog.user_op = 'A';
                userLog.entry_id = state_mast._id;
                var userLog_entry = new Date();
                var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var entrydatemilisecond = userDateObject.format('x');
                userLog.entry_date = userDateObject;
                userLog.entry_datemilisecond = entrydatemilisecond;
                await userLog.save();

            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.CityMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };

        const lastEntryNo = await citySchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { CityName: 1, StateName: 1, CityPinCode: 1, StdCode: 1 } }
        ]);

        const populatedEntries = await citySchema.populate(lastEntryNo, {
            path: 'StateName',
            select: 'StateName'
        });

        const totalCount = populatedEntries.length;

        res.json({ totalCount, lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CityMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await citySchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'citySchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting City:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CityTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        req.body.city && (qry._id = new mongoose.Types.ObjectId(req.body.city));
        console.log(qry)
        const lastEntryNo = await citySchema.aggregate([
            { $match: qry },
            { $project: { CityName: "$CityName", StateName: "$StateName" } }
        ]);
        const populatedEntries = await citySchema.populate(lastEntryNo, {
            path: 'StateName',
            select: 'StateName'
        });
        return res.json({ status: true, lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Maintenance Master
exports.MaintenanceMaster_Add = async (req, res) => {
    try {
        let state_mast = new maintenanceSchema();
        state_mast.Description = req.body.Description;
        state_mast.Code = req.body.Code;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await maintenanceSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Maintenance Name" });
            }

            const newState = {
                Description: req.body.Description,
                Code: req.body.Code,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await maintenanceSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'maintenanceSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await maintenanceSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Maintenance Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'maintenanceSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.MaintenanceMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await maintenanceSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Description: "$Description", Code: "$Code" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.MaintenanceMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await maintenanceSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'maintenanceSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Maintenance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Maker Master
exports.MakeMaster_Add = async (req, res) => {
    try {
        let state_mast = new makeSchema();
        state_mast.Description = req.body.Description;
        state_mast.Code = req.body.Code;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await makeSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                Description: req.body.Description,
                Code: req.body.Code,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await makeSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'makeSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await makeSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'makeSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ImportMake = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])

                if (step[s] != undefined && step[s]['Description'] != undefined) var Description = step[s]['Description'];
                else var Description = "";
                if (step[s] != undefined && step[s]['Code'] != undefined) var Code = step[s]['Code'];
                else var Code = "";
                var employeemaster = await makeSchema.findOne({ Description: Description, masterid: req.body.masterid })

                if (employeemaster && employeemaster._id.toString() !== req.body._id && employeemaster.del === 'N') {
                    console.log("Duplicate Description", Description);
                }
                else {
                    let state_mast = new makeSchema();
                    state_mast.Description = Description;
                    state_mast.Code = Code;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.entry = userDateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';

                    await state_mast.save();
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'makeSchema';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save();
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.MakeMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await makeSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Description: "$Description", Code: "$Code" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.MakeMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await makeSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'makeSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.MakeTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await makeSchema.aggregate([
            { $match: qry },
            { $project: { Description: "$Description", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Variant Master
exports.VariantMaster_Add = async (req, res) => {
    try {
        let state_mast = new variantSchema();
        state_mast.Description = req.body.Description;
        state_mast.Code = req.body.Code;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await variantSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                Description: req.body.Description,
                Code: req.body.Code,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await variantSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'variantSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await variantSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'variantSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ImportVariant = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])

                if (step[s] != undefined && step[s]['Description'] != undefined) var Description = step[s]['Description'];
                else var Description = "";
                if (step[s] != undefined && step[s]['Code'] != undefined) var Code = step[s]['Code'];
                else var Code = "";
                var employeemaster = await variantSchema.findOne({ Description: Description, masterid: req.body.masterid })

                if (employeemaster && employeemaster._id.toString() !== req.body._id && employeemaster.del === 'N') {
                    console.log("Duplicate Description", Description);
                }
                else {
                    let state_mast = new variantSchema();
                    state_mast.Description = Description;
                    state_mast.Code = Code;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.entry = userDateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';

                    await state_mast.save();
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'variantSchema';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save();
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.VariantMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await variantSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Description: "$Description", Code: "$Code" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VariantMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await variantSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'variantSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VariantTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await variantSchema.aggregate([
            { $match: qry },
            { $project: { Description: "$Description", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Model Master
exports.ModelMaster_Add = async (req, res) => {
    try {
        let state_mast = new modelSchema();
        state_mast.Description = req.body.Description;
        state_mast.Code = req.body.Code;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await modelSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                Description: req.body.Description,
                Code: req.body.Code,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await modelSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'modelSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await modelSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'modelSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ImportModel = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])

                if (step[s] != undefined && step[s]['Description'] != undefined) var Description = step[s]['Description'];
                else var Description = "";
                if (step[s] != undefined && step[s]['Code'] != undefined) var Code = step[s]['Code'];
                else var Code = "";
                var employeemaster = await modelSchema.findOne({ Description: Description, masterid: req.body.masterid })

                if (employeemaster && employeemaster._id.toString() !== req.body._id && employeemaster.del === 'N') {
                    console.log("Duplicate Description", Description);
                }
                else {
                    let state_mast = new modelSchema();
                    state_mast.Description = Description;
                    state_mast.Code = Code;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.entry = userDateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';

                    await state_mast.save();
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'modelSchema';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save();
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.ModelMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await modelSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Description: "$Description", Code: "$Code" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ModelMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await modelSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'modelSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ModelypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await modelSchema.aggregate([
            { $match: qry },
            { $project: { Description: "$Description", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Fuel Master
exports.FuelMaster_Add = async (req, res) => {
    try {
        let state_mast = new fuelSchema();
        state_mast.Description = req.body.Description;
        state_mast.Code = req.body.Code;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await fuelSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }

            const newState = {
                Description: req.body.Description,
                Code: req.body.Code,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await fuelSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'fuelSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await fuelSchema.findOne({ Description: req.body.Description, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Description Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'fuelSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.FuelMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await fuelSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Description: "$Description", Code: "$Code" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.FuelMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await fuelSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'fuelSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Document Master
exports.DocumentMaster_Add = async (req, res) => {
    try {
        let state_mast = new documentSchema();
        state_mast.Document = req.body.Document;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await documentSchema.findOne({ Document: req.body.Document, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Document Name" });
            }

            const newState = {
                Document: req.body.Document,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await documentSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'documentSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await documentSchema.findOne({ Document: req.body.Document, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Document Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'documentSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.DocumentMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await documentSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { Document: "$Document" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.DocumentMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await documentSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'documentSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.DoctypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await documentSchema.aggregate([
            { $match: qry },
            { $project: { Description: "$Document", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Customer Category Master
exports.CustomerCategoryMaster_Add = async (req, res) => {
    try {
        let state_mast = new CustomerCategorySchema();
        state_mast.CustomerCategory = req.body.CustomerCategory;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await CustomerCategorySchema.findOne({ CustomerCategory: req.body.CustomerCategory, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Customer Category" });
            }

            const newState = {
                CustomerCategory: req.body.CustomerCategory,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await CustomerCategorySchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'CustomerCategorySchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await CustomerCategorySchema.findOne({ CustomerCategory: req.body.CustomerCategory, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Customer Category" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'CustomerCategorySchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CustomerCategoryMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await CustomerCategorySchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { CustomerCategory: "$CustomerCategory" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerCategoryMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await CustomerCategorySchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'CustomerCategorySchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerCategoryTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await CustomerCategorySchema.aggregate([
            { $match: qry },
            { $project: { CustomerCategory: "$CustomerCategory", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Customer Type Master
exports.CustomerTypeMaster_Add = async (req, res) => {
    try {
        let state_mast = new CustomerTypeSchema();
        state_mast.CustomerType = req.body.CustomerType;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await CustomerTypeSchema.findOne({ CustomerType: req.body.CustomerType, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Customer Type" });
            }

            const newState = {
                CustomerType: req.body.CustomerType,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await CustomerTypeSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'CustomerTypeSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await CustomerTypeSchema.findOne({ CustomerType: req.body.CustomerType, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Customer Type" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'CustomerTypeSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CustomerTypeMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await CustomerTypeSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            { $project: { CustomerType: "$CustomerType" } }
        ]);
        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerTypeMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await CustomerTypeSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'CustomerTypeSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerTypeOptionsGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await CustomerTypeSchema.aggregate([
            { $match: qry },
            { $project: { CustomerType: "$CustomerType", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Bank Master
exports.BankMaster_Add = async (req, res) => {
    try {
        let state_mast = new bankSchema();
        state_mast.bankName = req.body.bankName;
        state_mast.noOfVehicleLimit = req.body.noOfVehicleLimit;
        state_mast.companyName = req.body.companyName;
        state_mast.bankBranch = req.body.bankBranch;
        state_mast.gstNo = req.body.gstNo;
        state_mast.address = req.body.address;
        state_mast.city = req.body.city;
        state_mast.contactDetails = req.body.contactDetails;
        state_mast.limit = req.body.limit;
        state_mast.percent = req.body.percent;
        state_mast.payoutAccount = req.body.payoutAccount;
        state_mast.limitAccount = req.body.limitAccount;
        state_mast.mail = req.body.mail;
        state_mast.cc = req.body.cc;
        state_mast.bcc = req.body.bcc;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await bankSchema.findOne({ bankName: req.body.bankName, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Bank Name" });
            }

            const newState = {
                bankName: req.body.bankName,
                noOfVehicleLimit: req.body.noOfVehicleLimit,
                companyName: req.body.companyName,
                bankBranch: req.body.bankBranch,
                gstNo: req.body.gstNo,
                address: req.body.address,
                city: req.body.city,
                contactDetails: req.body.contactDetails,
                limit: req.body.limit,
                percent: req.body.percent,
                payoutAccount: req.body.payoutAccount,
                limitAccount: req.body.limitAccount,
                mail: req.body.mail,
                cc: req.body.cc,
                bcc: req.body.bcc,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await bankSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'bankSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await bankSchema.findOne({ bankName: req.body.bankName, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Bank Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'bankSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ImportBank = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])
                if (step[s] != undefined && step[s]['Bank Name'] != undefined) var bankName = step[s]['Bank Name'];
                if (step[s] != undefined && step[s]['No of Vehicle Limit'] != undefined) var noOfVehicleLimit = step[s]['No of Vehicle Limit'];

                if (step[s] != undefined && step[s]['Company Name'] != undefined) var companyName = step[s]['Company Name'];
                else var companyName = "";
                if (step[s] != undefined && step[s]['Bank Branch'] != undefined) var bankBranch = step[s]['Bank Branch'];
                else var bankBranch = "";
                if (step[s] != undefined && step[s]['GST No'] != undefined) var gstNo = step[s]['GST No'];
                else var gstNo = "";
                if (step[s] != undefined && step[s]['Address'] != undefined) var address = step[s]['Address'];
                else var address = "";
                if (step[s] != undefined && step[s]['City'] != undefined) var city = step[s]['City'];
                else var city = "";
                if (step[s] != undefined && step[s]['Contact Details'] != undefined) var contactDetails = step[s]['Contact Details'];
                else var contactDetails = "";

                if (step[s] != undefined && step[s]['Limit'] != undefined) var limit = step[s]['Limit'];
                else var limit = "";
                if (step[s] != undefined && step[s]['%'] != undefined) var percent = step[s]['%'];
                else var percent = "";
                if (step[s] != undefined && step[s]['Payout Account'] != undefined) var payoutAccount = step[s]['Payout Account'];
                else var payoutAccount = "";
                if (step[s] != undefined && step[s]['Limit Account'] != undefined) var limitAccount = step[s]['Limit Account'];
                else var limitAccount = "";
                if (step[s] != undefined && step[s]['CC'] != undefined) var cc = step[s]['CC'];
                else var cc = "";
                if (step[s] != undefined && step[s]['BCC'] != undefined) var bcc = step[s]['BCC'];
                else var bcc = "";
                if (step[s] != undefined && step[s]['Mail'] != undefined) var mail = step[s]['Mail'];
                else var mail = "";

                var employeemaster = await bankSchema.findOne({ bankName: bankName, masterid: req.body.masterid })

                if (employeemaster && employeemaster._id.toString() !== req.body._id && employeemaster.del === 'N') {
                    console.log("Duplicate Bank Name", bankName);
                }
                else {
                    let payoutAccountData, limitAccountData, companyNameData, CItyNameData;

                    if (payoutAccount) {
                        const GroupData = await groupSchema.findOne({ GroupName: "PayOut A/c", masterid: req.body.masterid, del: "N" });
                        payoutAccountData = await accountSchema.findOne({ GroupName: GroupData?._id, ACName: payoutAccount, masterid: req.body.masterid, del: "N" });
                    }

                    if (limitAccount) {
                        const GroupData = await groupSchema.findOne({ GroupName: "Limit A/c", masterid: req.body.masterid, del: "N" });
                        limitAccountData = await accountSchema.findOne({ GroupName: GroupData?._id, ACName: limitAccount, masterid: req.body.masterid, del: "N" });
                    }

                    if (companyName) {
                        companyNameData = await DivSchema.findOne({ div_mast: companyName, masterid: req.body.masterid })
                    }

                    if (city) {
                        CItyNameData = await citySchema.findOne({ CityName: city, masterid: req.body.masterid })
                    }

                    let state_mast = new bankSchema();
                    state_mast.bankName = bankName;
                    state_mast.noOfVehicleLimit = noOfVehicleLimit;
                    state_mast.companyName = companyNameData?._id;
                    state_mast.bankBranch = bankBranch;
                    state_mast.gstNo = gstNo;
                    state_mast.address = address;
                    state_mast.city = CItyNameData?._id;
                    state_mast.contactDetails = contactDetails;
                    state_mast.limit = limit;
                    state_mast.percent = percent;
                    state_mast.payoutAccount = payoutAccountData?._id;
                    state_mast.limitAccount = limitAccountData?._id;
                    state_mast.mail = mail;
                    state_mast.cc = cc;
                    state_mast.bcc = bcc;

                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.entry = userDateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';

                    await state_mast.save();
                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'bankSchema';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save();
                }
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.BankMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };

        const lastEntryNo = await bankSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { bankName: 1, noOfVehicleLimit: 1, companyName: 1, bankBranch: 1, gstNo: 1, address: 1, city: 1, contactDetails: 1, limit: 1, percent: 1, payoutAccount: 1, limitAccount: 1, mail: 1, cc: 1, bcc: 1 } }
        ]);

        const populatedEntries = await bankSchema.populate(lastEntryNo, [
            { path: 'companyName', select: 'div_mast' },
            { path: 'city', select: 'CityName' },
            { path: 'payoutAccount', select: 'ACName' },
            { path: 'limitAccount', select: 'ACName' }
        ]);

        const totalCount = populatedEntries.length;

        res.json({ totalCount, lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.BankMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await bankSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'bankSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting City:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.BankTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        console.log(qry)
        const lastEntryNo = await bankSchema.aggregate([
            { $match: qry },
            // { $project: { bankName: "$bankName", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Account Master

exports.ImportAccountMaster = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                // console.log(s, step[s])
                if (step[s] != undefined && step[s]['Account Name'] != undefined) var ACName = step[s]['Account Name'];

                if (step[s] != undefined && step[s]['Group Name'] != undefined) var GroupName = step[s]['Group Name'];
                else var GroupName = "";
                if (step[s] != undefined && step[s]['Alias'] != undefined) var Alias = step[s]['Alias'];
                else var Alias = "";
                if (step[s] != undefined && step[s]["Opening Amt"] != undefined) var openingAmt = step[s]["Opening Amt"];
                else var openingAmt = "";
                if (step[s] != undefined && step[s]["Opening Amt Type"] != undefined) var OpeningAmtType = step[s]["Opening Amt Type"];
                else var OpeningAmtType = "";


                if (step[s] != undefined && step[s]['Address'] != undefined) var Address1 = step[s]['Address'];
                else var Address1 = "";
                if (step[s] != undefined && step[s]['Mobile No'] != undefined) var MobileNo = step[s]['Mobile No'];
                else var MobileNo = "";
                if (step[s] != undefined && step[s]['City'] != undefined) var CityName = step[s]['City'];
                else var CityName = "";
                if (step[s] != undefined && step[s]['State'] != undefined) var StateName = step[s]['State'];
                else var StateName = "";
                if (step[s] != undefined && step[s]['Pan No'] != undefined) var PanNumber = step[s]['Pan No'];
                else var PanNumber = "";
                if (step[s] != undefined && step[s]['GST No'] != undefined) var GSTIN = step[s]['GST No'];
                else var GSTIN = "";
                if (step[s] != undefined && step[s]['Aadhar No'] != undefined) var AadharNumber = step[s]['Aadhar No'];
                else var AadharNumber = "";

                if (step[s] != undefined && step[s]['Bank Name'] != undefined) var bank_name = step[s]['Bank Name'];
                else var bank_name = "";
                if (step[s] != undefined && step[s]['Branch'] != undefined) var bank_branch = step[s]['Branch'];
                else var bank_branch = "";
                if (step[s] != undefined && step[s]['Account No.'] != undefined) var bnk_ac_no = step[s]['Account No.'];
                else var bnk_ac_no = "";
                if (step[s] != undefined && step[s]['IFSC Code'] != undefined) var bank_ifsc = step[s]['IFSC Code'];
                else var bank_ifsc = "";

                let GroupNameData, CityData, StateData;


                if (GroupName) {
                    GroupNameData = await groupSchema.findOne({ GroupName: GroupName, masterid: req.body.masterid, del: "N" });
                }
                if (CityName) {
                    CityData = await citySchema.findOne({ CityName: CityName, masterid: req.body.masterid })
                }
                if (StateName) {
                    StateData = await stateSchema.findOne({ StateName: StateName, masterid: req.body.masterid })
                }

                const ac_bankArray = [
                    {
                        bank_name: bank_name,
                        bank_branch: bank_branch,
                        bank_ifsc: bank_ifsc,
                        bnk_ac_no: bnk_ac_no
                    }
                ];
                let existingAccount = await accountSchema.findOne({ ACName, masterid: req.body.masterid, GroupName: GroupNameData?._id });

                if (existingAccount && existingAccount.del === 'N') {
                    existingAccount.GroupName = GroupNameData?._id || existingAccount.GroupName;
                    existingAccount.Alias = Alias || existingAccount.Alias;
                    existingAccount.PanNumber = PanNumber || existingAccount.PanNumber;
                    existingAccount.CityName = CityData?._id || existingAccount.CityName;
                    existingAccount.StateName = StateData?._id || existingAccount.StateName;
                    existingAccount.MobileNo = MobileNo || existingAccount.MobileNo;
                    existingAccount.Address1 = Address1 || existingAccount.Address1;
                    existingAccount.GSTIN = GSTIN || existingAccount.GSTIN;
                    existingAccount.AadharNumber = AadharNumber || existingAccount.AadharNumber;
                    existingAccount.ac_bank = ac_bankArray.length ? ac_bankArray : existingAccount.ac_bank;

                    await existingAccount.save();

                    console.log("Updated Account:", ACName);
                    // return res.json({ status: false, message: "Duplicate Account Name" });
                }
                else {
                    let state_mast = new accountSchema();
                    state_mast.ACName = ACName;
                    state_mast.GroupName = GroupNameData?._id;
                    state_mast.Alias = Alias;
                    state_mast.PanNumber = PanNumber;
                    state_mast.CityName = CityData?._id;
                    state_mast.StateName = StateData?._id;
                    state_mast.MobileNo = MobileNo;
                    state_mast.Address1 = Address1;
                    state_mast.GSTIN = GSTIN;
                    state_mast.AadharNumber = AadharNumber;
                    state_mast.ac_bank = ac_bankArray;


                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    state_mast.user = req.body.user;
                    state_mast.masterid = req.body.masterid;
                    state_mast.entry = userDateObject;
                    state_mast.entry_datemilisecond = entrydatemilisecond;
                    state_mast.del = 'N';

                    await state_mast.save();

                    const companyInstance = await Company.findOne({ _id: req.body.compid });

                    let transMast = new transSchema();

                    transMast.main_bk = 'opening';
                    transMast.c_j_s_p = 'opening';
                    transMast.cashac_name = state_mast._id;
                    transMast.d_c = OpeningAmtType;
                    transMast.cash_amount = openingAmt;
                    var transLog_entry = new Date(companyInstance?.sdate);
                    var transDateObject = moment(transLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var transdatemilisecond = transDateObject.format('x');
                    transMast.cash_date = transDateObject;
                    transMast.cash_edatemilisecond = transdatemilisecond;

                    await transMast.save();

                    var userLog = new user_log;
                    userLog.user_name = req.body.user;
                    userLog.module_name = 'bankSchema';
                    userLog.user_op = 'A';
                    userLog.entry_id = state_mast._id;
                    var userLog_entry = new Date();
                    var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    var entrydatemilisecond = userDateObject.format('x');
                    userLog.entry_date = userDateObject;
                    userLog.entry_datemilisecond = entrydatemilisecond;
                    await userLog.save();
                }


            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.AccountMasterFileDownload = async (req, res) => {
    try {
        const filename = "Account Master Sheet.xlsx";
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename); // Adjusted path to locate the file in the uploads folder

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).send('File not found');
            }

            const readStream = fs.createReadStream(filePath);

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            readStream.pipe(res);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AccountMaster_Add = async (req, res) => {
    try {
        let state_mast = new accountSchema();
        state_mast.ACName = req.body.accountName;
        state_mast.GroupName = req.body.groupName;
        state_mast.Alias = req.body.alias;
        state_mast.PanNumber = req.body.panNo;
        state_mast.CityName = req.body.city;
        state_mast.StateName = req.body.StateName;
        state_mast.MobileNo = req.body.mobileNo;
        // state_mast.OpBalance = req.body.openingAmt;
        // state_mast.OpBalanceType = req.body.OpeningAmtType;
        state_mast.Address1 = req.body.address;
        state_mast.GSTIN = req.body.gstNo;
        state_mast.AadharNumber = req.body.aadharNo;
        state_mast.ac_bank = req.body.dropdownValues;
        state_mast.usrpwd = req.body.usrpwd;


        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await accountSchema.findOne({ ACName: req.body.accountName, masterid: req.body.masterid, GroupName: req.body.groupName, });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Account Name" });
            }

            const newState = {
                ACName: req.body.accountName,
                GroupName: req.body.groupName,
                PanNumber: req.body.panNo,
                Alias: req.body.alias,
                CityName: req.body.city,
                StateName: req.body.StateName,
                MobileNo: req.body.mobileNo,
                usrpwd: req.body.usrpwd,
                co_code: req.body.compid,
                div_code: req.body.divid,

                // OpBalance: req.body.openingAmt,
                // OpBalanceType: req.body.OpeningAmtType,
                Address1: req.body.address,
                GSTIN: req.body.gstNo,
                AadharNumber: req.body.aadharNo,
                ac_bank: req.body.dropdownValues,
                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await accountSchema.updateOne({ _id: req.body._id }, newState);

            const TransInstance = await transSchema.findOne({ cashac_name: req.body._id });
            // console.log("567",TransInstance)
            const newtransState = {
                d_c: req.body.OpeningAmtType,
                cash_amount: req.body.openingAmt,
            };

            await transSchema.updateOne({ _id: TransInstance?._id }, newtransState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'accountSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await accountSchema.findOne({ ACName: req.body.accountName, masterid: req.body.masterid, GroupName: req.body.groupName, });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Account Name" });
            }
            await state_mast.save();

            const companyInstance = await Company.findOne({ _id: req.body.compid });

            let transMast = new transSchema();

            transMast.main_bk = 'opening';
            transMast.c_j_s_p = 'opening';
            transMast.cashac_name = state_mast._id;
            transMast.d_c = req.body.OpeningAmtType;
            transMast.cash_amount = req.body.openingAmt;
            var transLog_entry = new Date(companyInstance?.sdate);
            var transDateObject = moment(transLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var transdatemilisecond = transDateObject.format('x');
            transMast.cash_date = transDateObject;
            transMast.cash_edatemilisecond = transdatemilisecond;

            await transMast.save();

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'accountSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.AccountMasterGET = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, seacrhString } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * pageLimit;
        const regex = new RegExp(seacrhString, 'i'); // Create a case-insensitive regex

        const qry = { masterid: req.query.masterid, del: "N" };
        if (seacrhString) {
            qry.$or = [
                { ACName: regex },
                { MobileNo: regex },
            ];
        }
        if (req.query.group && req.query.group.length > 0) {
            const groupIds = req.query.group.map(groupId => new mongoose.Types.ObjectId(groupId));
            qry.GroupName = { $in: groupIds };
        }

        let lastEntryNo;
        if (req.query.pageSize == 99) {
            lastEntryNo = await accountSchema.aggregate([
                { $match: qry },
                { $sort: { entry: 1 } },
                { $limit: 500 },
                {
                    $project: {
                        ACName: 1, GroupName: 1, Alias: 1, PanNumber: 1, CityName: 1, StateName: 1, MobileNo: 1, Address1: 1, GSTIN: 1, AadharNumber: 1, ac_bank: 1, usrpwd: 1,
                        _id: 1 // Include _id to match with transSchema
                    }
                }
            ]);
        }
        else {
            lastEntryNo = await accountSchema.aggregate([
                { $match: qry },
                { $sort: { entry: 1 } },
                { $skip: skip },
                { $limit: pageLimit },
                {
                    $project: {
                        ACName: 1, GroupName: 1, Alias: 1, PanNumber: 1, CityName: 1, StateName: 1, MobileNo: 1, Address1: 1, GSTIN: 1, AadharNumber: 1, ac_bank: 1, usrpwd: 1,
                        _id: 1 // Include _id to match with transSchema
                    }
                }
            ]);
        }


        const populatedEntries = await accountSchema.populate(lastEntryNo, [
            { path: 'StateName', select: 'StateName' },
            { path: 'CityName', select: 'CityName' },
            { path: 'GroupName', select: 'GroupName Address' } // Include Address field from GroupName
        ]);

        // Fetch d_c and cash_amount from transSchema for each populated entry
        const entriesWithTransData = await Promise.all(populatedEntries.map(async (entry) => {
            const transData = await transSchema.findOne({ cashac_name: entry._id }, { d_c: 1, cash_amount: 1 });
            return {
                ...entry,
                transData: transData ? transData.toObject() : {}
            };
        }));

        const totalCount = entriesWithTransData.length;
        const totalDocuments = await accountSchema.countDocuments(qry);

        res.json({ totalCount, lastEntryNo: entriesWithTransData, totalDocuments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AccountSetupAccountsGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N", main_bk: { $ne: 'Customer' } };
        if (req.query.group && req.query.group.length > 0) {
            const groupIds = req.query.group.map(groupId => new mongoose.Types.ObjectId(groupId));
            qry.GroupName = { $in: groupIds };
        }

        const lastEntryNo = await accountSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            {
                $project: {
                    ACName: 1,
                    GroupName: 1,
                    Alias: 1,
                    PanNumber: 1,
                    CityName: 1,
                    StateName: 1,
                    MobileNo: 1,
                    Address1: 1,
                    GSTIN: 1,
                    AadharNumber: 1,
                    ac_bank: 1,
                    _id: 1 // Include _id to match with transSchema
                }
            }
        ]);

        const populatedEntries = await accountSchema.populate(lastEntryNo, [
            { path: 'StateName', select: 'StateName' },
            { path: 'CityName', select: 'CityName' },
            { path: 'GroupName', select: 'GroupName Address' } // Include Address field from GroupName
        ]);

        // Fetch d_c and cash_amount from transSchema for each populated entry
        const entriesWithTransData = await Promise.all(populatedEntries.map(async (entry) => {
            const transData = await transSchema.findOne({ cashac_name: entry._id }, { d_c: 1, cash_amount: 1 });
            return {
                ...entry,
                transData: transData ? transData.toObject() : {}
            };
        }));

        const totalCount = entriesWithTransData.length;

        res.json({ totalCount, lastEntryNo: entriesWithTransData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AccountMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await accountSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'accountSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting City:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Group Setup

exports.GroupSetupNames_Add = async (req, res) => {
    try {
        // Extract the data to be inserted
        const data = [
            { group: "Payout Account", garry: [] },
            { group: "Limit Account", garry: [] },
            { group: "Customer", garry: [] },
            { group: "Executive", garry: [] },
            { group: "Sub Executive", garry: [] },
            { group: "Dealer", garry: [] },
            { group: "Sub Dealer", garry: [] },
            { group: "Loan Credit A/C", garry: [] },
            { group: "Bank", garry: [] },
            { group: "Cash", garry: [] },
            { group: "Agent", garry: [] }
        ];

        // Iterate over the data array and insert each entry into the database if it doesn't already exist
        for (const item of data) {
            const newState = {
                group: item.group,
                user: req.body.masterid,
                garry: item.garry,
            };

            // Check if an entry with the same group and user already exists
            const existingGroup = await group_setup_schema.findOne({
                group: newState.group,
                user: req.body.masterid
            });

            if (!existingGroup) {
                // If it doesn't exist, insert the new entry into the database
                const createdEntry = await group_setup_schema.create(newState);
            }
        }

        // Create a new user log entry
        const userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'group_setup_schema';
        userLog.user_op = 'A';
        userLog.entry_id = req.body.user;
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.GroupSetupTypesWithIDGET = async (req, res) => {
    try {
        const qry = { user: req.query.masterid };
        const result = await group_setup_schema.aggregate([
            { $match: qry },
            { $sort: { group: -1 } },
            { $project: { group: 1, _id: 1 } }
        ]);

        // Extract GroupName into an array
        const totalCount = result.length;

        res.json({ totalCount, groupNames: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GroupSetup_Add = async (req, res) => {
    try {
        if (req.body._id) {

            const newState = {
                garry: req.body.garry,
                user: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            // Update existing salary head
            await group_setup_schema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'group_setup_schema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.GroupSetupGET = async (req, res) => {
    try {
        const qry = { group: req.query.ID, user: req.query.masterid };
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        // Populating the entries with the related GroupName from groupSchema
        const populatedEntries = await group_setup_schema.populate(lastEntryNo, {
            path: 'garry',
            select: 'GroupName'
        });

        const totalCount = populatedEntries.length;

        res.json({ totalCount, lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.PayoutAccountGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Payout Account", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LimitAccountGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Limit Account", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Limit_Bank_CashGroupGET = async (req, res) => {
    try {
        // Step 1: Find the latest entry for "Bank" group
        const bankLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Bank", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Step 2: Find the latest entry for "Cash" group
        const cashLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Cash", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Step 3: Find the latest entry for "Cash" group
        const LimitLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Loan Credit A/C", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Combine the garry arrays from above results
        const combinedGarry = [
            ...(bankLastEntry[0]?.garry || []),
            ...(cashLastEntry[0]?.garry || []),
            ...(LimitLastEntry[0]?.garry || [])

        ];

        if (!combinedGarry.length) {
            return res.status(404).json({ error: 'No entries found for the specified criteria' });
        }

        // Step 4: Fetch groups based on the combined garry array
        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: combinedGarry }
        };

        const groups = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        console.log(groups)
        if (!groups.length) {
            return res.status(404).json({ error: 'No groups found for the specified criteria' });
        }

        const groupIds = groups.map(item => item._id);

        // Step 4: Fetch accounts based on the group ids
        const advanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const accounts = await accountSchema.aggregate([
            { $match: advanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: accounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Customer", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ExecutiveGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Executive", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.SubExecutiveGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Sub Executive", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.DealerGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Dealer", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);
        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);


        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);
        console.log(groupIds)

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.SubDealerGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Sub Dealer", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LoanCreditAcGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Loan Credit A/C", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Bank_CashGroupGET = async (req, res) => {
    try {
        // Step 1: Find the latest entry for "Bank" group
        const bankLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Bank", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Step 2: Find the latest entry for "Cash" group
        const cashLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Cash", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Combine the garry arrays from both results
        const combinedGarry = [
            ...(bankLastEntry[0]?.garry || []),
            ...(cashLastEntry[0]?.garry || [])
        ];

        if (!combinedGarry.length) {
            return res.status(404).json({ error: 'No entries found for the specified criteria' });
        }

        // Step 3: Fetch groups based on the combined garry array
        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: combinedGarry }
        };

        const groups = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        console.log(groups)
        if (!groups.length) {
            return res.status(404).json({ error: 'No groups found for the specified criteria' });
        }

        const groupIds = groups.map(item => item._id);

        // Step 4: Fetch accounts based on the group ids
        const advanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const accounts = await accountSchema.aggregate([
            { $match: advanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: accounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AgentGroupGET = async (req, res) => {
    try {
        const lastEntryNo = await group_setup_schema.aggregate([
            { $match: { group: "Agent", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);
        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: lastEntryNo[0].garry ? lastEntryNo[0].garry : [] }
        };

        const result = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);


        const groupIds = result.map(item => item._id);

        const AdvanceQry = {
            masterid: req.body.masterid,
            del: "N",
            GroupName: { $in: groupIds }
        };

        const results = await accountSchema.aggregate([
            { $match: AdvanceQry },
            { $sort: { entry: -1 } },
            { $project: { ACName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Customer Master

exports.ImportCustomerRegistration = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])
                if (step[s] != undefined && step[s]['Customer Name'] != undefined) var cutomer_name = step[s]['Customer Name'];
                if (step[s] != undefined && step[s]['Customer Category'] != undefined) var cutomer_category = step[s]['Customer Category'];

                if (step[s] != undefined && step[s]['Group'] != undefined) var GroupName = step[s]['Group'];
                else var GroupName = "";
                if (step[s] != undefined && step[s]['Alias'] != undefined) var Alias = step[s]['Alias'];
                else var Alias = "";
                if (step[s] != undefined && step[s]["Father's Name"] != undefined) var fathername = step[s]["Father's Name"];
                else var fathername = "";
                if (step[s] != undefined && step[s]["Mother's Name"] != undefined) var mothername = step[s]["Mother's Name"];
                else var mothername = "";
                if (step[s] != undefined && step[s]['Gender'] != undefined) var gender = step[s]['Gender'];
                else var gender = "";
                if (step[s] != undefined && step[s]['Martial Status'] != undefined) var martial_status = step[s]['Martial Status'];
                else var martial_status = "";


                if (step[s] != undefined && step[s]['Present Address'] != undefined) var Address1 = step[s]['Present Address'];
                else var Address1 = "";
                if (step[s] != undefined && step[s]['Present Address2'] != undefined) var PresentAddressLine2 = step[s]['Present Address2'];
                else var PresentAddressLine2 = "";
                if (step[s] != undefined && step[s]['Present City'] != undefined) var PresentCity = step[s]['Present City'];
                else var PresentCity = "";
                if (step[s] != undefined && step[s]['Present Phone Number'] != undefined) var PresentPhoneNumber = step[s]['Present Phone Number'];
                else var PresentPhoneNumber = "";
                if (step[s] != undefined && step[s]['Present Mobile Number'] != undefined) var MobileNo = step[s]['Present Mobile Number'];
                else var MobileNo = "";

                if (step[s] != undefined && step[s]['Permanent Address'] != undefined) var PermanentAddress = step[s]['Permanent Address'];
                else var PermanentAddress = "";
                if (step[s] != undefined && step[s]['Permanent Address2'] != undefined) var PermanentAddressLine2 = step[s]['Permanent Address2'];
                else var PermanentAddressLine2 = "";
                if (step[s] != undefined && step[s]['Permanent City'] != undefined) var PermanentCity = step[s]['Permanent City'];
                else var PermanentCity = "";
                if (step[s] != undefined && step[s]['Permanent Phone Number'] != undefined) var PermanentPhoneNumber = step[s]['Permanent Phone Number'];
                else var PermanentPhoneNumber = "";
                if (step[s] != undefined && step[s]['Permanent Mobile Number'] != undefined) var PermanentMobileNumber = step[s]['Permanent Mobile Number'];
                else var PermanentMobileNumber = "";

                if (step[s] != undefined && step[s]['Work Address'] != undefined) var WorkAddress = step[s]['Work Address'];
                else var WorkAddress = "";
                if (step[s] != undefined && step[s]['Work Address2'] != undefined) var WorkAddressLine2 = step[s]['Work Address2'];
                else var WorkAddressLine2 = "";
                if (step[s] != undefined && step[s]['Work City'] != undefined) var WorkCity = step[s]['Work City'];
                else var WorkCity = "";
                if (step[s] != undefined && step[s]['Work Phone Number'] != undefined) var WorkPhoneNumber = step[s]['Work Phone Number'];
                else var WorkPhoneNumber = "";
                if (step[s] != undefined && step[s]['Work Mobile Number'] != undefined) var WorkMobileNumber = step[s]['Work Mobile Number'];
                else var WorkMobileNumber = "";

                if (step[s] != undefined && step[s]['Refference1 Address'] != undefined) var Refference1Address = step[s]['Refference1 Address'];
                else var Refference1Address = "";
                if (step[s] != undefined && step[s]['Refference1 Address2'] != undefined) var Refference1AddressLine2 = step[s]['Refference1 Address2'];
                else var Refference1AddressLine2 = "";
                if (step[s] != undefined && step[s]['Refference1 City'] != undefined) var Refference1City = step[s]['Refference1 City'];
                else var Refference1City = "";
                if (step[s] != undefined && step[s]['Refference1 Phone Number'] != undefined) var Refference1PhoneNumber = step[s]['Refference1 Phone Number'];
                else var Refference1PhoneNumber = "";
                if (step[s] != undefined && step[s]['Refference1 Mobile Number'] != undefined) var Refference1MobileNumber = step[s]['Refference1 Mobile Number'];
                else var Refference1MobileNumber = "";

                if (step[s] != undefined && step[s]['Refference2 Address'] != undefined) var Refference2Address = step[s]['Refference2 Address'];
                else var Refference2Address = "";
                if (step[s] != undefined && step[s]['Refference2 Address2'] != undefined) var Refference2AddressLine2 = step[s]['Refference2 Address2'];
                else var Refference2AddressLine2 = "";
                if (step[s] != undefined && step[s]['Refference2 City'] != undefined) var Refference2City = step[s]['Refference2 City'];
                else var Refference2City = "";
                if (step[s] != undefined && step[s]['Refference2 Phone Number'] != undefined) var Refference2PhoneNumber = step[s]['Refference2 Phone Number'];
                else var Refference2PhoneNumber = "";
                if (step[s] != undefined && step[s]['Refference2 Mobile Number'] != undefined) var Refference2MobileNumber = step[s]['Refference2 Mobile Number'];
                else var Refference2MobileNumber = "";

                if (step[s] != undefined && step[s]['No. Of Dependent ID'] != undefined) var noOfDependentID = step[s]['No. Of Dependent ID'];
                else var noOfDependentID = "";
                if (step[s] != undefined && step[s]['Email ID'] != undefined) var emailID = step[s]['Email ID'];
                else var emailID = "";
                if (step[s] != undefined && step[s]['Employement Type'] != undefined) var employmentType = step[s]['Employement Type'];
                else var employmentType = "";
                if (step[s] != undefined && step[s]['Last CTC'] != undefined) var lastCTC = step[s]['Last CTC'];
                else var lastCTC = "";
                if (step[s] != undefined && step[s]['In Hand'] != undefined) var inhand = step[s]['In Hand'];
                else var inhand = "";
                if (step[s] != undefined && step[s]['Designation'] != undefined) var designation = step[s]['Designation'];
                else var designation = "";
                if (step[s] != undefined && step[s]['Religion'] != undefined) var religion = step[s]['Religion'];
                else var religion = "";
                if (step[s] != undefined && step[s]['Category'] != undefined) var category = step[s]['Category'];
                else var category = "";
                if (step[s] != undefined && step[s]['Guarantee'] != undefined) var guarantee = step[s]['Guarantee'];
                else var guarantee = "";
                if (step[s] != undefined && step[s]['Physical Disabled'] != undefined) var physicalDisabled = step[s]['Physical Disabled'];
                else var physicalDisabled = "";
                if (step[s] != undefined && step[s]['DOB'] != undefined) var dob = step[s]['DOB'];
                else var dob = "";
                if (step[s] != undefined && step[s]['Loan Bank Name'] != undefined) var loanBankName = step[s]['Loan Bank Name'];
                else var loanBankName = "";
                if (step[s] != undefined && step[s]['Loan Type'] != undefined) var loanType = step[s]['Loan Type'];
                else var loanType = "";
                if (step[s] != undefined && step[s]['Amount'] != undefined) var loanamount = step[s]['Amount'];
                else var loanamount = "";
                if (step[s] != undefined && step[s]['Emi(Month)'] != undefined) var laonemi = step[s]['Emi(Month)'];
                else var laonemi = "";
                if (step[s] != undefined && step[s]['Tenure'] != undefined) var loantenure = step[s]['Tenure'];
                else var loantenure = "";
                if (step[s] != undefined && step[s]['Loan A/C No'] != undefined) var loanAccountNo = step[s]['Loan A/C No'];
                else var loanAccountNo = "";
                if (step[s] != undefined && step[s]['St. Date'] != undefined) var startDate = step[s]['St. Date'];
                else var startDate = "";

                if (step[s] != undefined && step[s]['Bank Name'] != undefined) var bank_name = step[s]['Bank Name'];
                else var bank_name = "";
                if (step[s] != undefined && step[s]['Branch'] != undefined) var bank_branch = step[s]['Branch'];
                else var bank_branch = "";
                if (step[s] != undefined && step[s]['Account No.'] != undefined) var bnk_ac_no = step[s]['Account No.'];
                else var bnk_ac_no = "";
                if (step[s] != undefined && step[s]['IFSC Code'] != undefined) var bank_ifsc = step[s]['IFSC Code'];
                else var bank_ifsc = "";

                let cutomer_categoryData, PresentCityData, PermanentCityData, WorkCityData, Refference1CityData, Refference2CityData, GroupNameData;

                if (cutomer_category) {
                    cutomer_categoryData = await CustomerCategorySchema.findOne({ CustomerCategory: cutomer_category, masterid: req.body.masterid, del: "N" });
                }
                if (GroupName) {
                    GroupNameData = await groupSchema.findOne({ GroupName: GroupName, masterid: req.body.masterid, del: "N" });
                }
                if (PresentCity) {
                    PresentCityData = await citySchema.findOne({ CityName: PresentCity, masterid: req.body.masterid })
                }
                if (PermanentCity) {
                    PermanentCityData = await citySchema.findOne({ CityName: PermanentCity, masterid: req.body.masterid })
                }
                if (WorkCity) {
                    WorkCityData = await citySchema.findOne({ CityName: WorkCity, masterid: req.body.masterid })
                }
                if (Refference1City) {
                    Refference1CityData = await citySchema.findOne({ CityName: Refference1City, masterid: req.body.masterid })
                }
                if (Refference2City) {
                    Refference2CityData = await citySchema.findOne({ CityName: Refference2City, masterid: req.body.masterid })
                }

                const ac_bankArray = [
                    {
                        bank_name: bank_name,
                        bank_branch: bank_branch,
                        bank_ifsc: bank_ifsc,
                        bnk_ac_no: bnk_ac_no
                    }
                ];

                // let state_mast = new accountSchema();
                // state_mast.cutomer_name = cutomer_name;
                // state_mast.ACName = cutomer_name;
                // state_mast.cutomer_category = cutomer_categoryData?._id;
                // state_mast.father_name = fathername;
                // state_mast.mother_name = mothername;
                // state_mast.gender = gender;
                // state_mast.martial_status = martial_status;
                // state_mast.GroupName = GroupNameData?._id;
                // state_mast.Alias = Alias;
                // state_mast.ac_bank = ac_bankArray;
                // state_mast.main_bk = "Customer";

                // // Present Address  
                // state_mast.Address1 = Address1;
                // state_mast.PresentAddressLine2 = PresentAddressLine2;
                // if (PresentCityData) { state_mast.CityName = PresentCityData?._id; }
                // state_mast.PresentPhoneNumber = PresentPhoneNumber;
                // state_mast.MobileNo = MobileNo;

                // // Permanent Address
                // state_mast.PermanentAddress = PermanentAddress;
                // state_mast.PermanentAddressLine2 = PermanentAddressLine2;
                // if (PermanentCityData) { state_mast.PermanentCity = PermanentCityData?._id; }
                // state_mast.PermanentPhoneNumber = PermanentPhoneNumber;
                // state_mast.PermanentMobileNumber = PermanentMobileNumber;

                // // Work Address
                // state_mast.WorkAddress = WorkAddress;
                // state_mast.WorkAddressLine2 = WorkAddressLine2;
                // if (WorkCityData) { state_mast.WorkCity = WorkCityData?._id; }
                // state_mast.WorkPhoneNumber = WorkPhoneNumber;
                // state_mast.WorkMobileNumber = WorkMobileNumber;

                // // Refference1 Address
                // state_mast.Refference1Address = Refference1Address;
                // state_mast.Refference1AddressLine2 = Refference1AddressLine2;
                // if (Refference1CityData) { state_mast.Refference1City = Refference1CityData?._id; }
                // state_mast.Refference1PhoneNumber = Refference1PhoneNumber;
                // state_mast.Refference1MobileNumber = Refference1MobileNumber;

                // // Refference2 Address
                // state_mast.Refference2Address = Refference2Address;
                // state_mast.Refference2AddressLine2 = Refference2AddressLine2;
                // if (Refference2CityData) { state_mast.Refference2City = Refference2CityData?._id; }
                // state_mast.Refference2PhoneNumber = Refference2PhoneNumber;
                // state_mast.Refference2MobileNumber = Refference2MobileNumber;

                // // Other Details
                // state_mast.noOfDependentID = noOfDependentID;
                // state_mast.emailID = emailID;
                // state_mast.employmentType = employmentType;
                // state_mast.lastCTC = lastCTC;
                // state_mast.designation = designation;
                // state_mast.religion = religion;
                // state_mast.category = category;
                // state_mast.physicalDisabled = physicalDisabled;
                // state_mast.guarantee = guarantee;
                // if (dob) {
                //     state_mast.dob = moment(dob).tz("Asia/Kolkata");
                //     state_mast.dob_datemilisecond = moment(dob).tz("Asia/Kolkata").format('x');
                // }

                // // Loan Requirment Details
                // state_mast.loanBankName = loanBankName;
                // state_mast.loanType = loanType;
                // state_mast.loanamount = loanamount;
                // state_mast.laonemi = laonemi;
                // state_mast.loantenure = loantenure;
                // state_mast.loanAccountNo = loanAccountNo;
                // if (startDate) {
                //     state_mast.startDate = moment(startDate).tz("Asia/Kolkata");
                //     state_mast.startDate_datemilisecond = moment(startDate).tz("Asia/Kolkata").format('x');
                // }

                // var userLog_entry = new Date();
                // var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                // var entrydatemilisecond = userDateObject.format('x');
                // state_mast.user = req.body.user;
                // state_mast.masterid = req.body.masterid;
                // state_mast.entry = userDateObject;
                // state_mast.entry_datemilisecond = entrydatemilisecond;
                // state_mast.del = 'N';

                // await state_mast.save();
                const updateData = {
                    cutomer_name,
                    ACName: cutomer_name,
                    cutomer_category: cutomer_categoryData?._id,
                    father_name: fathername,
                    mother_name: mothername,
                    gender,
                    martial_status,
                    GroupName: GroupNameData?._id,
                    Alias,
                    ac_bank: ac_bankArray,
                    main_bk: "Customer",

                    // Present Address  
                    Address1,
                    PresentAddressLine2,
                    CityName: PresentCityData?._id,
                    PresentPhoneNumber,
                    MobileNo,

                    // Permanent Address
                    PermanentAddress,
                    PermanentAddressLine2,
                    PermanentCity: PermanentCityData?._id,
                    PermanentPhoneNumber,
                    PermanentMobileNumber,

                    // Work Address
                    WorkAddress,
                    WorkAddressLine2,
                    WorkCity: WorkCityData?._id,
                    WorkPhoneNumber,
                    WorkMobileNumber,

                    // Refference1 Address
                    Refference1Address,
                    Refference1AddressLine2,
                    Refference1City: Refference1CityData?._id,
                    Refference1PhoneNumber,
                    Refference1MobileNumber,

                    // Refference2 Address
                    Refference2Address,
                    Refference2AddressLine2,
                    Refference2City: Refference2CityData?._id,
                    Refference2PhoneNumber,
                    Refference2MobileNumber,

                    // Other Details
                    noOfDependentID,
                    emailID,
                    employmentType,
                    lastCTC,
                    inhand,
                    designation,
                    religion,
                    category,
                    physicalDisabled,
                    guarantee,
                    dob: dob ? moment(dob).tz("Asia/Kolkata") : undefined,
                    dob_datemilisecond: dob ? moment(dob).tz("Asia/Kolkata").format('x') : undefined,

                    // Loan Requirement Details
                    loanBankName,
                    loanType,
                    loanamount,
                    laonemi,
                    loantenure,
                    loanAccountNo,
                    startDate: startDate ? moment(startDate).tz("Asia/Kolkata") : undefined,
                    startDate_datemilisecond: startDate ? moment(startDate).tz("Asia/Kolkata").format('x') : undefined,

                    // Log Entry Details
                    entry: moment().tz("Asia/Kolkata"),
                    entry_datemilisecond: moment().tz("Asia/Kolkata").format('x'),
                    user: req.body.user,
                    masterid: req.body.masterid,
                    del: 'N'
                };

                const state_mast = await accountSchema.findOneAndUpdate(
                    { cutomer_name: cutomer_name, masterid: req.body.masterid }, // search criteria
                    { $set: updateData }, // fields to update
                    { upsert: true, new: true } // create if not found, return the updated document
                );
                var userLog = new user_log;
                userLog.user_name = req.body.user;
                userLog.module_name = 'bankSchema';
                userLog.user_op = 'A';
                userLog.entry_id = state_mast._id;
                var userLog_entry = new Date();
                var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var entrydatemilisecond = userDateObject.format('x');
                userLog.entry_date = userDateObject;
                userLog.entry_datemilisecond = entrydatemilisecond;
                await userLog.save();

            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.CustomerRegistrationFileDownload = async (req, res) => {
    try {
        const filename = "Customer Registration Sheet.xlsx";
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename); // Adjusted path to locate the file in the uploads folder

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).send('File not found');
            }

            const readStream = fs.createReadStream(filePath);

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            readStream.pipe(res);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerMaster_Add = async (req, res) => {
    try {
        let state_mast = new accountSchema();
        state_mast.cutomer_name = req.body.customerName;
        state_mast.ACName = req.body.customerName;
        state_mast.cutomer_category = req.body.customerCategory;
        state_mast.cutomer_type = req.body.customerType;
        state_mast.father_name = req.body.fatherName;
        state_mast.mother_name = req.body.motherName;
        state_mast.gender = req.body.gender;
        state_mast.martial_status = req.body.maritalStatus;
        state_mast.GroupName = req.body.group;
        state_mast.Alias = req.body.alias;
        state_mast.ac_bank = req.body.dropdownValues;
        if (req.body.date) {
            state_mast.date = moment(req.body.date).tz("Asia/Kolkata");
            state_mast.date_datemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
        }
        state_mast.Dealer = req.body.Dealer;
        state_mast.main_bk = "Customer";

        // Present Address  
        state_mast.Address1 = req.body.PresentAddress;
        state_mast.PresentAddressLine2 = req.body.PresentAddressLine2;
        if (req.body.PresentCity) { state_mast.CityName = req.body.PresentCity; }
        state_mast.PresentPhoneNumber = req.body.PresentPhoneNumber;
        state_mast.MobileNo = req.body.PresentMobileNumber;
        state_mast.PresentPincode = req.body.PresentPincode;

        // Permanent Address
        state_mast.PermanentAddress = req.body.PermanentAddress;
        state_mast.PermanentAddressLine2 = req.body.PermanentAddressLine2;
        if (req.body.PermanentCity) { state_mast.PermanentCity = req.body.PermanentCity; }
        state_mast.PermanentPhoneNumber = req.body.PermanentPhoneNumber;
        state_mast.PermanentMobileNumber = req.body.PermanentMobileNumber;
        state_mast.PermanentPincode = req.body.PermanentPincode;

        // Work Address
        state_mast.WorkFirm = req.body.WorkFirm;
        state_mast.WorkAddress = req.body.WorkAddress;
        state_mast.WorkAddressLine2 = req.body.WorkAddressLine2;
        if (req.body.WorkCity) { state_mast.WorkCity = req.body.WorkCity; }
        state_mast.WorkPhoneNumber = req.body.WorkPhoneNumber;
        state_mast.WorkMobileNumber = req.body.WorkMobileNumber;
        state_mast.WorkPincode = req.body.WorkPincode;

        // Refference1 Address
        state_mast.Refference1Address = req.body.Refference1Address;
        state_mast.Refference1AddressLine2 = req.body.Refference1AddressLine2;
        if (req.body.Refference1City) { state_mast.Refference1City = req.body.Refference1City; }
        state_mast.Refference1PhoneNumber = req.body.Refference1PhoneNumber;
        state_mast.Refference1MobileNumber = req.body.Refference1MobileNumber;
        state_mast.Refference1Pincode = req.body.Refference1Pincode;

        // Refference2 Address
        state_mast.Refference2Address = req.body.Refference2Address;
        state_mast.Refference2AddressLine2 = req.body.Refference2AddressLine2;
        if (req.body.Refference2City) { state_mast.Refference2City = req.body.Refference2City; }
        state_mast.Refference2PhoneNumber = req.body.Refference2PhoneNumber;
        state_mast.Refference2MobileNumber = req.body.Refference2MobileNumber;
        state_mast.Refference2Pincode = req.body.Refference2Pincode;

        // Other Details
        state_mast.noOfDependentID = req.body.noOfDependentID;
        state_mast.emailID = req.body.emailID;
        state_mast.employmentType = req.body.employmentType;
        state_mast.lastCTC = req.body.lastCTC;
        state_mast.inhand = req.body.inhand;
        state_mast.designation = req.body.designation;
        state_mast.religion = req.body.religion;
        state_mast.category = req.body.category;
        state_mast.physicalDisabled = req.body.physicalDisabled;
        state_mast.guarantee = req.body.guarantee;
        if (req.body.dob) {
            state_mast.dob = moment(req.body.dob).tz("Asia/Kolkata");
            state_mast.dob_datemilisecond = moment(req.body.dob).tz("Asia/Kolkata").format('x');
        }

        // Loan Requirment Details
        state_mast.loanBankName = req.body.loanBankName;
        state_mast.loanType = req.body.loanType;
        state_mast.loanamount = req.body.amount;
        state_mast.laonemi = req.body.emi;
        state_mast.loantenure = req.body.tenure;
        state_mast.loanAccountNo = req.body.loanAccountNo;
        if (req.body.startDate) {
            state_mast.startDate = moment(req.body.startDate).tz("Asia/Kolkata");
            state_mast.startDate_datemilisecond = moment(req.body.startDate).tz("Asia/Kolkata").format('x');
        }


        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            let newState = {};
            newState = {
                cutomer_name: req.body.customerName,
                ACName: req.body.customerName,
                cutomer_category: req.body.customerCategory,
                cutomer_type: req.body.customerType,
                father_name: req.body.fatherName,
                mother_name: req.body.motherName,
                gender: req.body.gender,
                martial_status: req.body.maritalStatus,
                guarantee: req.body.guarantee,
                GroupName: req.body.group,
                Alias: req.body.Alias,
                ac_bank: req.body.dropdownValues,
                Dealer: req.body.Dealer,

                // Present Address   
                Address1: req.body.PresentAddress,
                PresentAddressLine2: req.body.PresentAddressLine2,
                CityName: req.body.PresentCity,
                PresentPhoneNumber: req.body.PresentPhoneNumber,
                MobileNo: req.body.PresentMobileNumber,
                PresentPincode: req.body.PresentPincode,
                // Permanent Address
                PermanentAddress: req.body.PermanentAddress,
                PermanentAddressLine2: req.body.PermanentAddressLine2,
                PermanentCity: req.body.PermanentCity,
                PermanentPhoneNumber: req.body.PermanentPhoneNumber,
                PermanentMobileNumber: req.body.PermanentMobileNumber,
                PermanentPincode: req.body.PermanentPincode,

                // Work Address
                WorkFirm: req.body.WorkFirm,
                WorkAddress: req.body.WorkAddress,
                WorkAddressLine2: req.body.WorkAddressLine2,
                WorkCity: req.body.WorkCity,
                WorkPhoneNumber: req.body.WorkPhoneNumber,
                WorkMobileNumber: req.body.WorkMobileNumber,
                WorkPincode: req.body.WorkPincode,

                // Refference1 Address
                Refference1Address: req.body.Refference1Address,
                Refference1AddressLine2: req.body.Refference1AddressLine2,
                Refference1City: req.body.Refference1City,
                Refference1PhoneNumber: req.body.Refference1PhoneNumber,
                Refference1MobileNumber: req.body.Refference1MobileNumber,
                Refference1Pincode: req.body.Refference1Pincode,

                // Refference2 Address
                Refference2Address: req.body.Refference2Address,
                Refference2AddressLine2: req.body.Refference2AddressLine2,
                Refference2City: req.body.Refference2City,
                Refference2PhoneNumber: req.body.Refference2PhoneNumber,
                Refference2MobileNumber: req.body.Refference2MobileNumber,
                Refference2Pincode: req.body.Refference2Pincode,

                // Other Details
                noOfDependentID: req.body.noOfDependentID,
                emailID: req.body.emailID,
                employmentType: req.body.employmentType,
                lastCTC: req.body.lastCTC,
                inhand: req.body.inhand,
                designation: req.body.designation,
                religion: req.body.religion,
                category: req.body.category,
                physicalDisabled: req.body.physicalDisabled,
                guarantee: req.body.guarantee,
                // dob: moment(req.body.dob).tz("Asia/Kolkata"),
                // dob_datemilisecond: moment(req.body.dob).tz("Asia/Kolkata").format('x'),

                // Loan Requirment Details
                loanBankName: req.body.loanBankName,
                loanType: req.body.loanType,
                loanamount: req.body.amount,
                laonemi: req.body.emi,
                loantenure: req.body.tenure,
                loanAccountNo: req.body.loanAccountNo,
                // startDate: moment(req.body.startDate).tz("Asia/Kolkata"),
                // startDate_datemilisecond: moment(req.body.startDate).tz("Asia/Kolkata").format('x'),

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };

            if (req.body.date) {
                newState.date = moment(req.body.date).tz("Asia/Kolkata");
                newState.date_datemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            }

            if (req.body.dob) {
                newState.dob = moment(req.body.dob).tz("Asia/Kolkata");
                newState.dob_datemilisecond = newState.dob.format('x');
            }
            if (req.body.startDate) {
                newState.startDate = moment(req.body.startDate).tz("Asia/Kolkata");
                newState.startDate_datemilisecond = newState.startDate.format('x');
            }
            // Update existing salary head
            await accountSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'accountSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {

            await state_mast.save();

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'accountSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CustomerMasterGET = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, seacrhString } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * pageLimit;
        const regex = new RegExp(seacrhString, 'i'); // Create a case-insensitive regex

        const qry = { masterid: req.query.masterid, main_bk: "Customer", del: "N" };
        if (seacrhString) {
            qry.$or = [
                { ACName: regex },
                { MobileNo: regex },
            ];
        }
        let lastEntryNo;
        if (req.query.pageSize == 99) {
            lastEntryNo = await accountSchema.aggregate([
                { $match: qry },
                { $sort: { entry: 1 } },
                // { $skip: skip },
                { $limit: 500 }
            ]);
        }
        else {
            lastEntryNo = await accountSchema.aggregate([
                { $match: qry },
                { $sort: { entry: 1 } },
                { $skip: skip },
                { $limit: pageLimit }
            ]);
        }



        const populatedEntries = await accountSchema.populate(lastEntryNo, [
            { path: 'CityName', select: 'CityName' },
            { path: 'WorkCity', select: 'CityName' },
            { path: 'PresentCity', select: 'CityName' },
            { path: 'PermanentCity', select: 'CityName' },
            { path: 'WorkCity', select: 'CityName' },
            { path: 'Refference2City', select: 'CityName' },
            { path: 'Refference1City', select: 'CityName' },
            { path: 'cutomer_category', select: 'CustomerCategory' },
            { path: 'GroupName', select: 'GroupName' },
            { path: 'WorkFirm', select: 'div_mast' },
            { path: 'cutomer_type', select: 'CustomerType' },
            { path: 'Dealer', select: 'ACName' },
        ]);
        const totalDocuments = await accountSchema.countDocuments(qry);

        res.json({ lastEntryNo: populatedEntries, totalDocuments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await accountSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'accountSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GuranterGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, guarantee: "Y" }
        console.log(qry)
        const lastEntryNo = await accountSchema.aggregate([
            { $match: qry },
            { $project: { cutomer_name: "$cutomer_name", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Customer Application

exports.ImportCustomerApplication = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }

            var docs = [];
            for (s = 0; s < step.length; s++) {
                console.log(s, step[s])
                if (step[s] != undefined && step[s]['_id'] != undefined) var _id = step[s]['_id'];
                if (step[s] != undefined && step[s]['Stage'] != undefined) var stage = step[s]['Stage'];
                if (step[s] != undefined && step[s]['Bank'] != undefined) var bank = step[s]['Bank'];
                if (step[s] != undefined && step[s]['Firm'] != undefined) var firm = step[s]['Firm'];

                if (step[s] != undefined && step[s]['Refference No.'] != undefined) var RefferenceNo = step[s]['Refference No.'];
                else var RefferenceNo = "";
                if (step[s] != undefined && step[s]['Bank 2'] != undefined) var bank2 = step[s]['Bank 2'];
                else var bank2 = "";
                if (step[s] != undefined && step[s]["Firm 2"] != undefined) var firm2 = step[s]["Firm 2"];
                else var firm2 = "";
                if (step[s] != undefined && step[s]["Date"] != undefined) var date = step[s]["Date"];
                else var date = "";
                if (step[s] != undefined && step[s]['Applicant'] != undefined) var Applicant = step[s]['Applicant'];
                else var Applicant = "";
                if (step[s] != undefined && step[s]['Co-Applicant'] != undefined) var CoApplicant = step[s]['Co-Applicant'];
                else var CoApplicant = "";
                if (step[s] != undefined && step[s]['Guranter'] != undefined) var Guranter = step[s]['Guranter'];
                else var Guranter = "";
                if (step[s] != undefined && step[s]['Vehicle No.'] != undefined) var VehicleNo = step[s]['Vehicle No.'];
                else var VehicleNo = "";
                if (step[s] != undefined && step[s]['Make'] != undefined) var Make = step[s]['Make'];
                else var Make = "";
                if (step[s] != undefined && step[s]['Model'] != undefined) var Model = step[s]['Model'];
                else var Model = "";
                if (step[s] != undefined && step[s]['Variant'] != undefined) var Variant = step[s]['Variant'];
                else var Variant = "";
                if (step[s] != undefined && step[s]['Executive'] != undefined) var Executive = step[s]['Executive'];
                else var Executive = "";
                if (step[s] != undefined && step[s]['Sub-Executive'] != undefined) var SubExecutive = step[s]['Sub-Executive'];
                else var SubExecutive = "";
                if (step[s] != undefined && step[s]['Dealer'] != undefined) var Dealer = step[s]['Dealer'];
                else var Dealer = "";
                if (step[s] != undefined && step[s]['Sub-Dealer'] != undefined) var SubDealer = step[s]['Sub-Dealer'];
                else var SubDealer = "";
                if (step[s] != undefined && step[s]['Los No.'] != undefined) var LosNo = step[s]['Los No.'];
                else var LosNo = "";
                if (step[s] != undefined && step[s]['FI'] != undefined) var FI = step[s]['FI'];
                else var FI = "";
                if (step[s] != undefined && step[s]['CIBIL Score'] != undefined) var CIBILScore = step[s]['CIBIL Score'];
                else var CIBILScore = "";
                if (step[s] != undefined && step[s]['Ex-Showroom Price'] != undefined) var ExShowroomPrice = step[s]['Ex-Showroom Price'];
                else var ExShowroomPrice = "";
                if (step[s] != undefined && step[s]['Loan Amount'] != undefined) var LoanAmount = step[s]['Loan Amount'];
                else var LoanAmount = "";
                if (step[s] != undefined && step[s]['Tenure Duration Month'] != undefined) var Tenure = step[s]['Tenure Duration Month'];
                else var Tenure = "";

                // Login Stage
                if (step[s] != undefined && step[s]['Login Remark'] != undefined) var Login_remark = step[s]['Login Remark'];
                else var Login_remark = "";

                // SoftApproval Stage
                if (step[s] != undefined && step[s]['SoftApproval Bank'] != undefined) var SoftApproval_bank = step[s]['SoftApproval Bank'];
                else var SoftApproval_bank = "";
                if (step[s] != undefined && step[s]['SoftApproval Firm'] != undefined) var SoftApproval_firm = step[s]['SoftApproval Firm'];
                else var SoftApproval_firm = "";
                if (step[s] != undefined && step[s]['SoftApproval CRCC'] != undefined) var SoftApproval_crcc = step[s]['SoftApproval CRCC'];
                else var SoftApproval_crcc = "";
                if (step[s] != undefined && step[s]['SoftApproval Date'] != undefined) var SoftApproval_date = step[s]['SoftApproval Date'];
                else var SoftApproval_date = "";
                if (step[s] != undefined && step[s]['SoftApproval Amount'] != undefined) var SoftApproval_Amount = step[s]['SoftApproval Amount'];
                else var SoftApproval_Amount = "";
                if (step[s] != undefined && step[s]['SoftApproval Tenure'] != undefined) var SoftApproval_Tenure = step[s]['SoftApproval Tenure'];
                else var SoftApproval_Tenure = "";
                if (step[s] != undefined && step[s]['SoftApproval Remark'] != undefined) var SoftApproval_remark = step[s]['SoftApproval Remark'];
                else var SoftApproval_remark = "";
                // Reject Stage 
                if (step[s] != undefined && step[s]['Reject Query'] != undefined) var Reject_query = step[s]['Reject Query'];
                else var Reject_query = "";
                if (step[s] != undefined && step[s]['Reject Date'] != undefined) var Reject_date = step[s]['Reject Date'];
                else var Reject_date = "";
                // Cancelled Stage 
                if (step[s] != undefined && step[s]['Cancelled Query'] != undefined) var Cancelled_query = step[s]['Cancelled Query'];
                else var Cancelled_query = "";
                if (step[s] != undefined && step[s]['Cancelled Date'] != undefined) var Cancelled_date = step[s]['Cancelled Date'];
                else var Cancelled_date = "";

                // Approved Stage
                if (step[s] != undefined && step[s]['Approved Bank'] != undefined) var Approved_bank = step[s]['Approved Bank'];
                else var Approved_bank = "";
                if (step[s] != undefined && step[s]['Approved Firm'] != undefined) var Approved_firm = step[s]['Approved Firm'];
                else var Approved_firm = "";
                if (step[s] != undefined && step[s]['Approved CRCC'] != undefined) var Approved_crcc = step[s]['Approved CRCC'];
                else var Approved_crcc = "";
                if (step[s] != undefined && step[s]['Approved Date'] != undefined) var Approved_date = step[s]['Approved Date'];
                else var Approved_date = "";
                if (step[s] != undefined && step[s]['Approved Amount'] != undefined) var Approved_Amount = step[s]['Approved Amount'];
                else var Approved_Amount = "";
                if (step[s] != undefined && step[s]['Approved Tenure'] != undefined) var Approved_Tenure = step[s]['Approved Tenure'];
                else var Approved_Tenure = "";
                if (step[s] != undefined && step[s]['Approved Remark'] != undefined) var Approved_remark = step[s]['Approved Remark'];
                else var Approved_remark = "";

                // UnderDisbursement Stage
                if (step[s] != undefined && step[s]['UnderDisbursement Bank'] != undefined) var UnderDisbursement_bank = step[s]['UnderDisbursement Bank'];
                else var UnderDisbursement_bank = "";
                if (step[s] != undefined && step[s]['UnderDisbursement Firm'] != undefined) var UnderDisbursement_firm = step[s]['UnderDisbursement Firm'];
                else var UnderDisbursement_firm = "";
                if (step[s] != undefined && step[s]['UnderDisbursement CRCC'] != undefined) var UnderDisbursement_crcc = step[s]['UnderDisbursement CRCC'];
                else var UnderDisbursement_crcc = "";
                if (step[s] != undefined && step[s]['UnderDisbursement Date'] != undefined) var UnderDisbursement_date = step[s]['UnderDisbursement Date'];
                else var UnderDisbursement_date = "";
                if (step[s] != undefined && step[s]['UnderDisbursement Interest%'] != undefined) var UnderDisbursement_Interest = step[s]['UnderDisbursement Interest%'];
                else var UnderDisbursement_Interest = "";
                if (step[s] != undefined && step[s]['UnderDisbursement EMI'] != undefined) var UnderDisbursement_EMI = step[s]['UnderDisbursement EMI'];
                else var UnderDisbursement_EMI = "";
                if (step[s] != undefined && step[s]['UnderDisbursement Query'] != undefined) var UnderDisbursement_Query = step[s]['UnderDisbursement Query'];
                else var UnderDisbursement_Query = "";
                if (step[s] != undefined && step[s]['UnderDisbursement Amount'] != undefined) var UnderDisbursement_Amount = step[s]['UnderDisbursement Amount'];
                else var UnderDisbursement_Amount = "";
                if (step[s] != undefined && step[s]['UnderDisbursement Tenure'] != undefined) var UnderDisbursement_Tenure = step[s]['UnderDisbursement Tenure'];
                else var UnderDisbursement_Tenure = "";

                // Disbursement Stage
                if (step[s] != undefined && step[s]['Disbursement Date'] != undefined) var Disbursement_date = step[s]['Disbursement Date'];
                else var Disbursement_date = "";
                if (step[s] != undefined && step[s]['Disbursement Bank'] != undefined) var Disbursement_bank = step[s]['Disbursement Bank'];
                else var Disbursement_bank = "";
                if (step[s] != undefined && step[s]['Disbursement Firm'] != undefined) var Disbursement_firm = step[s]['Disbursement Firm'];
                else var Disbursement_firm = "";
                if (step[s] != undefined && step[s]['Disbursement Loan Amount'] != undefined) var Disbursement_loanAmount = step[s]['Disbursement Loan Amount'];
                else var Disbursement_loanAmount = "";
                if (step[s] != undefined && step[s]['Disbursement Tenure'] != undefined) var Disbursement_tenure = step[s]['Disbursement Tenure'];
                else var Disbursement_tenure = "";
                if (step[s] != undefined && step[s]['Disbursement Rate'] != undefined) var Disbursement_rate = step[s]['Disbursement Rate'];
                else var Disbursement_rate = "";
                if (step[s] != undefined && step[s]['Disbursement EMI'] != undefined) var Disbursement_emi = step[s]['Disbursement EMI'];
                else var Disbursement_emi = "";
                if (step[s] != undefined && step[s]['Disbursement EMI Start Date'] != undefined) var Disbursement_emiStartDate = step[s]['Disbursement EMI Start Date'];
                else var Disbursement_emiStartDate = "";
                if (step[s] != undefined && step[s]['Disbursement P/F'] != undefined) var Disbursement_pf = step[s]['Disbursement P/F'];
                else var Disbursement_pf = "";
                if (step[s] != undefined && step[s]['Disbursement Stamp'] != undefined) var Disbursement_stamp = step[s]['Disbursement Stamp'];
                else var Disbursement_stamp = "";
                if (step[s] != undefined && step[s]['Disbursement Installment'] != undefined) var Disbursement_installment = step[s]['Disbursement Installment'];
                else var Disbursement_installment = "";
                if (step[s] != undefined && step[s]['Disbursement M.I'] != undefined) var Disbursement_mi = step[s]['Disbursement M.I'];
                else var Disbursement_mi = "";
                if (step[s] != undefined && step[s]['Disbursement S.K'] != undefined) var Disbursement_sk = step[s]['Disbursement S.K'];
                else var Disbursement_sk = "";
                if (step[s] != undefined && step[s]['Disbursement Other'] != undefined) var Disbursement_other = step[s]['Disbursement Other'];
                else var Disbursement_other = "";
                if (step[s] != undefined && step[s]['Disbursement Net Bank Amount Recived'] != undefined) var Disbursement_netBankAmountReceived = step[s]['Disbursement Net Bank Amount Recived'];
                else var Disbursement_netBankAmountReceived = "";
                if (step[s] != undefined && step[s]['Disbursement RTO'] != undefined) var Disbursement_rto = step[s]['Disbursement RTO'];
                else var Disbursement_rto = "";
                if (step[s] != undefined && step[s]['Disbursement Other 1'] != undefined) var Disbursement_other1 = step[s]['Disbursement Other 1'];
                else var Disbursement_other1 = "";
                if (step[s] != undefined && step[s]['Disbursement Net Paid To Dealer'] != undefined) var Disbursement_netPaidToDealer = step[s]['Disbursement Net Paid To Dealer'];
                else var Disbursement_netPaidToDealer = "";
                if (step[s] != undefined && step[s]['Disbursement Loan Credit A/C'] != undefined) var Disbursement_loanCreditAC = step[s]['Disbursement Loan Credit A/C'];
                else var Disbursement_loanCreditAC = "";
                if (step[s] != undefined && step[s]['Disbursement Loan Type'] != undefined) var Disbursement_loanType = step[s]['Disbursement Loan Type'];
                else var Disbursement_loanType = "";
                if (step[s] != undefined && step[s]['Disbursement Pay Out %'] != undefined) var Disbursement_payOutPercentage = step[s]['Disbursement Pay Out %'];
                else var Disbursement_payOutPercentage = "";
                if (step[s] != undefined && step[s]['Disbursement Gross Cos Recived'] != undefined) var Disbursement_grossCosReceived = step[s]['Disbursement Gross Cos Recived'];
                else var Disbursement_grossCosReceived = "";
                if (step[s] != undefined && step[s]['Disbursement TDS %'] != undefined) var Disbursement_tdsPercentage = step[s]['Disbursement TDS %'];
                else var Disbursement_tdsPercentage = "";
                if (step[s] != undefined && step[s]['Disbursement GST %'] != undefined) var Disbursement_gstPercentage = step[s]['Disbursement GST %'];
                else var Disbursement_gstPercentage = "";
                if (step[s] != undefined && step[s]['Disbursement Net Com Recived'] != undefined) var Disbursement_netComReceived = step[s]['Disbursement Net Com Recived'];
                else var Disbursement_netComReceived = "";
                if (step[s] != undefined && step[s]['Disbursement Dealer'] != undefined) var Disbursement_dealer = step[s]['Disbursement Dealer'];
                else var Disbursement_dealer = "";
                if (step[s] != undefined && step[s]['Disbursement Comm %'] != undefined) var Disbursement_commPercentage = step[s]['Disbursement Comm %'];
                else var Disbursement_commPercentage = "";
                if (step[s] != undefined && step[s]['Disbursement Com Amount'] != undefined) var Disbursement_commAmount = step[s]['Disbursement Com Amount'];
                else var Disbursement_commAmount = "";
                if (step[s] != undefined && step[s]['Disbursement Executive'] != undefined) var Disbursement_executive = step[s]['Disbursement Executive'];
                else var Disbursement_executive = "";
                if (step[s] != undefined && step[s]['Disbursement Executive Com Rupees'] != undefined) var Disbursement_executiveComRupees = step[s]['Disbursement Executive Com Rupees'];
                else var Disbursement_executiveComRupees = "";
                if (step[s] != undefined && step[s]['Disbursement Sub Executive'] != undefined) var Disbursement_subExecutive = step[s]['Disbursement Sub Executive'];
                else var Disbursement_subExecutive = "";
                if (step[s] != undefined && step[s]['Disbursement Sub Executive Comm Rupees'] != undefined) var Disbursement_subExecutiveComRupees = step[s]['Disbursement Sub Executive Comm Rupees'];
                else var Disbursement_subExecutiveComRupees = "";
                if (step[s] != undefined && step[s]['Disbursement Net Remaining Amount'] != undefined) var Disbursement_netRemainingAmount = step[s]['Disbursement Net Remaining Amount'];
                else var Disbursement_netRemainingAmount = "";
                if (step[s] != undefined && step[s]['Disbursement Remark'] != undefined) var Disbursement_remark = step[s]['Disbursement Remark'];
                else var Disbursement_remark = "";
                if (step[s] != undefined && step[s]['Disbursement Comm Paid'] != undefined) var Disbursement_commPaid = step[s]['Disbursement Comm Paid'];
                else var Disbursement_commPaid = "";
                if (step[s] != undefined && step[s]['Disbursement Comm Recived'] != undefined) var Disbursement_commReceived = step[s]['Disbursement Comm Recived'];
                else var Disbursement_commReceived = "";
                if (step[s] != undefined && step[s]['Bank Name'] != undefined) var newBank = step[s]['Bank Name'];
                else var newBank = "";
                if (step[s] != undefined && step[s]['Account No.'] != undefined) var newAccNo = step[s]['Account No.'];
                else var newAccNo = "";
                if (step[s] != undefined && step[s]['Branch'] != undefined) var newBranch = step[s]['Branch'];
                else var newBranch = "";
                if (step[s] != undefined && step[s]['IFCS Code'] != undefined) var newIFSCCode = step[s]['IFCS Code'];
                else var newIFSCCode = "";
                if (step[s] != undefined && step[s]['Remark 1'] != undefined) var remark1 = step[s]['Remark 1'];
                else var remark1 = "";
                if (step[s] != undefined && step[s]['Remark 2'] != undefined) var remark2 = step[s]['Remark 2'];
                else var remark2 = "";
                let UnderDisbursementcompanyNameData, UnderDisbursementBankData, companyNameData, companyNameData2, BankData, BankData2, ApplicantData, CoApplicantData, GuranterData, MakeData, ModelData;
                let VariantData, ExecutiveData, SubExecutiveData, DealerData, SubDealerData;

                if (firm) {
                    companyNameData = await DivSchema.findOne({ div_mast: firm, masterid: req.body.masterid })
                }
                if (firm2) {
                    companyNameData2 = await DivSchema.findOne({ div_mast: firm2, masterid: req.body.masterid })
                }
                if (bank) {
                    BankData = await bankSchema.findOne({ bankName: bank, masterid: req.body.masterid })
                }
                if (bank2) {
                    BankData2 = await bankSchema.findOne({ bankName: bank2, masterid: req.body.masterid })
                }
                if (Applicant) {
                    ApplicantData = await accountSchema.findOne({ ACName: Applicant, masterid: req.body.masterid });
                }
                if (CoApplicant) {
                    CoApplicantData = await accountSchema.findOne({ ACName: CoApplicant, masterid: req.body.masterid });
                }
                if (Guranter) {
                    GuranterData = await accountSchema.findOne({ ACName: Guranter, masterid: req.body.masterid });
                }
                if (Make) {
                    MakeData = await makeSchema.findOne({ Description: Make, masterid: req.body.masterid });
                }
                if (Model) {
                    ModelData = await modelSchema.findOne({ Description: Model, masterid: req.body.masterid });
                }
                if (Variant) {
                    VariantData = await variantSchema.findOne({ Description: Variant, masterid: req.body.masterid });
                }
                if (Executive) {
                    ExecutiveData = await accountSchema.findOne({ ACName: Executive, masterid: req.body.masterid });
                }
                if (SubExecutive) {
                    SubExecutiveData = await accountSchema.findOne({ ACName: SubExecutive, masterid: req.body.masterid });
                }
                if (Dealer) {
                    DealerData = await accountSchema.findOne({ ACName: Dealer, masterid: req.body.masterid });
                }
                if (SubDealer) {
                    SubDealerData = await accountSchema.findOne({ ACName: SubDealer, masterid: req.body.masterid });
                }

                // SoftApproval Stage
                let SoftApprovalcompanyNameData, SoftApprovalBankData;

                if (SoftApproval_firm) {
                    SoftApprovalcompanyNameData = await DivSchema.findOne({ div_mast: SoftApproval_firm, masterid: req.body.masterid })
                }
                if (SoftApproval_bank) {
                    SoftApprovalBankData = await bankSchema.findOne({ bankName: SoftApproval_bank, masterid: req.body.masterid })
                }

                // Approved Stage
                let ApprovedcompanyNameData, ApprovedBankData;

                if (Approved_firm) {
                    ApprovedcompanyNameData = await DivSchema.findOne({ div_mast: Approved_firm, masterid: req.body.masterid })
                }
                if (Approved_bank) {
                    ApprovedBankData = await bankSchema.findOne({ bankName: Approved_bank, masterid: req.body.masterid })
                }

                // UnderDisbursement Stage

                if (UnderDisbursement_firm) {
                    UnderDisbursementcompanyNameData = await DivSchema.findOne({ div_mast: UnderDisbursement_firm, masterid: req.body.masterid })
                }
                if (UnderDisbursement_bank) {
                    UnderDisbursementBankData = await bankSchema.findOne({ bankName: UnderDisbursement_bank, masterid: req.body.masterid })
                }
                // Disbursement Stage
                let DisbursementcompanyNameData, DisbursementBankData, DisbursementloanCreditACData, DisbursementLoanTypeData, DisbursementDealerData;
                let DisbursementExecutiveData, DisbursementSubExecutiveData;
                if (Disbursement_firm) {
                    DisbursementcompanyNameData = await DivSchema.findOne({ div_mast: Disbursement_firm, masterid: req.body.masterid })
                }
                if (Disbursement_bank) {
                    DisbursementBankData = await bankSchema.findOne({ bankName: Disbursement_bank, masterid: req.body.masterid })
                }
                if (Disbursement_loanCreditAC) {
                    DisbursementloanCreditACData = await accountSchema.findOne({ ACName: Disbursement_loanCreditAC, masterid: req.body.masterid })
                }
                if (Disbursement_loanType) {
                    DisbursementLoanTypeData = await CustomerCategorySchema.findOne({ CustomerCategory: Disbursement_loanType, masterid: req.body.masterid })
                }
                if (Disbursement_dealer) {
                    DisbursementDealerData = await accountSchema.findOne({ ACName: Disbursement_dealer, masterid: req.body.masterid })
                }
                if (Disbursement_executive) {
                    DisbursementExecutiveData = await accountSchema.findOne({ ACName: Disbursement_executive, masterid: req.body.masterid })
                }
                if (Disbursement_subExecutive) {
                    DisbursementSubExecutiveData = await accountSchema.findOne({ ACName: Disbursement_subExecutive, masterid: req.body.masterid })
                }

                // const ApplicationNo = await CustomerApplicationSchema.aggregate([
                //     { $match: { masterid: req.body.masterid } },
                //     { $group: { _id: null, ApplicationNo: { $max: "$ApplicationNo" } } }
                // ]);

                // const MaxApplicationNo = ApplicationNo[0]?.ApplicationNo || 0;

                // let state_mast = new CustomerApplicationSchema();

                let state_mast = await CustomerApplicationSchema.findOne({ _id, masterid: req.body.masterid });

                if (!state_mast) {
                    state_mast = new CustomerApplicationSchema();
                    const ApplicationNo = await CustomerApplicationSchema.aggregate([
                        { $match: { masterid: req.body.masterid } },
                        { $group: { _id: null, ApplicationNo: { $max: "$ApplicationNo" } } }
                    ]);
                    const MaxApplicationNo = ApplicationNo[0]?.ApplicationNo || 0;
                    state_mast.ApplicationNo = MaxApplicationNo + 1;
                }

                state_mast.stage = stage;
                state_mast.bank = BankData?._id;
                state_mast.firm = companyNameData?._id;
                // state_mast.ApplicationNo = Number(MaxApplicationNo) + 1;
                state_mast.RefferenceNo = RefferenceNo;
                state_mast.bank2 = BankData2?._id;
                state_mast.firm2 = companyNameData2?._id;
                if (date) {
                    const parsedDate = moment(date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.date = parsedDate.toDate(); // Converts the moment object to a JS Date object
                    state_mast.date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }

                state_mast.Applicant = ApplicantData?._id;
                state_mast.CoApplicant = CoApplicantData?._id;
                state_mast.Guranter = GuranterData?._id;
                state_mast.VehicleNo = VehicleNo;
                state_mast.Make = MakeData?._id;
                state_mast.Model = ModelData?._id;
                state_mast.Variant = VariantData?._id;
                state_mast.Executive = ExecutiveData?._id;
                state_mast.SubExecutive = SubExecutiveData?._id;
                state_mast.Dealer = DealerData?._id;
                state_mast.SubDealer = SubDealerData?._id;
                state_mast.LosNo = LosNo;
                state_mast.CIBILScore = CIBILScore;
                state_mast.FI = FI;
                state_mast.ExShowroomPrice = ExShowroomPrice;
                state_mast.LoanAmount = LoanAmount;
                state_mast.Tenure = Tenure;

                // Login Stage 
                state_mast.Login_remark = Login_remark;

                // SoftApproval Stage
                state_mast.SoftApproval_bank = SoftApprovalBankData?._id;
                state_mast.SoftApproval_firm = SoftApprovalcompanyNameData?._id;
                state_mast.SoftApproval_crcc = SoftApproval_crcc;
                if (SoftApproval_date) {
                    const parsedDate = moment(SoftApproval_date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.SoftApproval_date = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.SoftApproval_date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }

                state_mast.SoftApproval_Amount = SoftApproval_Amount;
                state_mast.SoftApproval_Tenure = SoftApproval_Tenure;
                state_mast.SoftApproval_remark = SoftApproval_remark;

                // Reject Stage 
                state_mast.Reject_query = Reject_query;
                if (Reject_date) {
                    const parsedDate = moment(Reject_date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.Reject_date = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.Reject_date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }
                // Cancelled Stage 
                state_mast.Cancelled_query = Cancelled_query;
                if (Cancelled_date) {
                    const parsedDate = moment(Cancelled_date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.Cancelled_date = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.Cancelled_date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }
                // Approved Stage
                state_mast.Approved_bank = ApprovedBankData?._id;
                state_mast.Approved_firm = ApprovedcompanyNameData?._id;
                state_mast.Approved_crcc = Approved_crcc;
                if (Approved_date) {
                    const parsedDate = moment(Approved_date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.Approved_date = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.Approved_date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }

                state_mast.Approved_Amount = Approved_Amount;
                state_mast.Approved_Tenure = Approved_Tenure;
                state_mast.Approved_remark = Approved_remark;

                // UnderDisbursement Stage
                if (UnderDisbursement_date) {
                    const parsedDate = moment(UnderDisbursement_date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.UnderDisbursement_date = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.UnderDisbursement_date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }
                state_mast.UnderDisbursement_bank = UnderDisbursementBankData?._id;
                state_mast.UnderDisbursement_firm = UnderDisbursementcompanyNameData?._id;
                state_mast.UnderDisbursement_crcc = UnderDisbursement_crcc;

                state_mast.UnderDisbursement_Query = UnderDisbursement_Query;
                state_mast.UnderDisbursement_Interest = UnderDisbursement_Interest;
                state_mast.UnderDisbursement_EMI = UnderDisbursement_EMI;
                state_mast.UnderDisbursement_Amount = UnderDisbursement_Amount;
                state_mast.UnderDisbursement_Tenure = UnderDisbursement_Tenure;

                // Disbursement Stage
                if (Disbursement_date) {
                    const parsedDate = moment(Disbursement_date, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.Disbursement_date = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.Disbursement_date_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }

                state_mast.Disbursement_bank = DisbursementBankData?._id;
                state_mast.Disbursement_firm = DisbursementcompanyNameData?._id;
                state_mast.Disbursement_loanAmount = Disbursement_loanAmount;
                state_mast.Disbursement_tenure = Disbursement_tenure;
                state_mast.Disbursement_rate = Disbursement_rate;
                state_mast.Disbursement_emi = Disbursement_emi;
                if (Disbursement_emiStartDate) {
                    const parsedDate = moment(Disbursement_emiStartDate, 'DD/MM/YYYY').tz("Asia/Kolkata");
                    state_mast.Disbursement_emiStartDate = parsedDate.toDate(); // Converts to JavaScript Date object
                    state_mast.Disbursement_emiStartDate_datemilisecond = parsedDate.format('x'); // Gets the timestamp in milliseconds
                }

                state_mast.Disbursement_pf = Disbursement_pf;
                state_mast.Disbursement_stamp = Disbursement_stamp;
                state_mast.Disbursement_installment = Disbursement_installment;
                state_mast.Disbursement_mi = Disbursement_mi;
                state_mast.Disbursement_sk = Disbursement_sk;
                state_mast.Disbursement_other = Disbursement_other;
                state_mast.Disbursement_netBankAmountReceived = Disbursement_netBankAmountReceived;
                state_mast.Disbursement_rto = Disbursement_rto;
                state_mast.Disbursement_other1 = Disbursement_other1;
                state_mast.Disbursement_netPaidToDealer = Disbursement_netPaidToDealer;
                state_mast.Disbursement_loanCreditAC = DisbursementloanCreditACData?._id;
                state_mast.Disbursement_loanType = DisbursementLoanTypeData?._id;
                state_mast.Disbursement_payOutPercentage = Disbursement_payOutPercentage;
                state_mast.Disbursement_grossCosReceived = Disbursement_grossCosReceived;
                state_mast.Disbursement_tdsPercentage = Disbursement_tdsPercentage;
                state_mast.Disbursement_gstPercentage = Disbursement_gstPercentage;
                state_mast.Disbursement_netComReceived = Disbursement_netComReceived;
                state_mast.Disbursement_dealer = DisbursementDealerData?._id;
                state_mast.Disbursement_commPercentage = Disbursement_commPercentage;
                state_mast.Disbursement_commAmount = Disbursement_commAmount;
                state_mast.Disbursement_executive = DisbursementExecutiveData?._id;
                state_mast.Disbursement_executiveComRupees = Disbursement_executiveComRupees;
                state_mast.Disbursement_subExecutive = DisbursementSubExecutiveData?._id;
                state_mast.Disbursement_subExecutiveComRupees = Disbursement_subExecutiveComRupees;
                state_mast.Disbursement_netRemainingAmount = Disbursement_netRemainingAmount;
                state_mast.Disbursement_remark = Disbursement_remark;
                state_mast.Disbursement_commPaid = Disbursement_commPaid;
                state_mast.Disbursement_commReceived = Disbursement_commReceived;
                state_mast.newBank = newBank;
                state_mast.newAccNo = newAccNo;
                state_mast.newBranch = newBranch;
                state_mast.newIFSCCode = newIFSCCode;

                state_mast.remark1 = remark1;
                state_mast.remark2 = remark2;

                var userLog_entry = new Date();
                var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var entrydatemilisecond = userDateObject.format('x');
                state_mast.user = req.body.user;
                state_mast.masterid = req.body.masterid;
                state_mast.entry = userDateObject;
                state_mast.entry_datemilisecond = entrydatemilisecond;
                state_mast.del = 'N';

                await state_mast.save();

                var userLog = new user_log;
                userLog.user_name = req.body.user;
                userLog.module_name = 'CustomerApplicationSchema';
                userLog.user_op = 'A';
                userLog.entry_id = state_mast._id;
                var userLog_entry = new Date();
                var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                var entrydatemilisecond = userDateObject.format('x');
                userLog.entry_date = userDateObject;
                userLog.entry_datemilisecond = entrydatemilisecond;
                await userLog.save();
            }
        }
        return res.status(200).json({ status: true, message: 'Import Successful' });
    } catch (error) {
        return res.status(500).json({ error: error.message, message: error.message });
    }
}

exports.CustomerApplicationFileDownload = async (req, res) => {
    try {
        const filename = "Customer Application Sheet.xlsx";
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename); // Adjusted path to locate the file in the uploads folder

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return res.status(404).send('File not found');
            }

            const readStream = fs.createReadStream(filePath);

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            readStream.pipe(res);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.MaxApplicationNo = async (req, res) => {
    try {
        const result = await CustomerApplicationSchema.aggregate([
            { $match: { masterid: req.body.masterid } },
            {
                $group: {
                    _id: null,
                    ApplicationNo: {
                        $max: {
                            $convert: {
                                input: "$ApplicationNo",
                                to: "int",
                                onError: 0,  // Default to 0 if conversion fails
                                onNull: 0    // Default to 0 if the value is null
                            }
                        }
                    }
                }
            }
        ]);

        // Return the max ApplicationNo or 0 if no result
        const maxApplicationNo = result.length > 0 ? result[0].ApplicationNo : 0;

        res.json({ ApplicationNo: maxApplicationNo });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.CustomerApplication_Add = async (req, res) => {
    try {
        if (req.body.vehicleNo && !req.body.vehicleNo.toLowerCase().includes("new")) {
            const checkVehical = await CustomerApplicationSchema.find({ VehicleNo: { $regex: new RegExp(`^${req.body.vehicleNo}$`, "i") }, masterid: req.body.masterid });
            if (checkVehical.length > 0) {
                return res.json({ status: false, message: "Duplicate Vehical Number", checkVehical });
            }
        }
        let state_mast = new CustomerApplicationSchema();
        state_mast.stage = req.body.stage;
        state_mast.bank = req.body.bank;
        state_mast.firm = req.body.firm;
        state_mast.ApplicationNo = req.body.applicationNo;
        state_mast.RefferenceNo = req.body.referenceNo;
        state_mast.bank2 = req.body.bank2;
        state_mast.firm2 = req.body.firm2;
        state_mast.date = moment(req.body.date).tz("Asia/Kolkata");
        state_mast.date_datemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');;
        state_mast.Applicant = req.body.applicant;
        state_mast.CoApplicant = req.body.coApplicant;
        state_mast.Guranter = req.body.guarantor;
        state_mast.VehicleNo = req.body.vehicleNo;
        state_mast.engineNo = req.body.engineNo;
        state_mast.chasisNo = req.body.chasisNo;
        state_mast.Make = req.body.make;
        state_mast.Model = req.body.model;
        state_mast.Variant = req.body.variant;
        state_mast.Executive = req.body.executive;
        state_mast.SubExecutive = req.body.subExecutive;
        state_mast.Dealer = req.body.dealer;
        state_mast.SubDealer = req.body.subDealer;
        state_mast.LosNo = req.body.losNo;
        state_mast.CIBILScore = req.body.cibilScore;
        state_mast.FI = req.body.fi;
        state_mast.ExShowroomPrice = req.body.exShowroomPrice;
        state_mast.LoanAmount = req.body.loanAmount;
        state_mast.Tenure = req.body.tenureDurationMonth;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'CustomerApplicationSchema';
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

exports.CustomerApplication_Update = async (req, res) => {
    try {
        const newState = {
            bank: req.body.bank,
            firm: req.body.firm,
            ApplicationNo: req.body.applicationNo,
            RefferenceNo: req.body.referenceNo,
            bank2: req.body.bank2,
            firm2: req.body.firm2,
            date: moment(req.body.date).tz("Asia/Kolkata"),
            date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            Applicant: req.body.applicant,
            CoApplicant: req.body.coApplicant,
            Guranter: req.body.guarantor,
            VehicleNo: req.body.vehicleNo,
            engineNo: req.body.engineNo,
            chasisNo: req.body.chasisNo,
            Make: req.body.make,
            Model: req.body.model,
            Variant: req.body.variant,
            Executive: req.body.executive,
            SubExecutive: req.body.subExecutive,
            Dealer: req.body.dealer,
            SubDealer: req.body.subDealer,
            LosNo: req.body.losNo,
            CIBILScore: req.body.cibilScore,
            FI: req.body.fi,
            ExShowroomPrice: req.body.exShowroomPrice,
            LoanAmount: req.body.loanAmount,
            Tenure: req.body.tenureDurationMonth,
            user: req.body.user,
            masterid: req.body.masterid,
            update: userDateObject,
            update_datemilisecond: entrydatemilisecond,
            del: 'N'
        };
        await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'CustomerApplicationSchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CustomerApplicationGET = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, seacrhString } = req.query;  // Default values
        const pageNumber = parseInt(page, 10);
        const regex = new RegExp(seacrhString, 'i'); // Create a case-insensitive regex

        const isAll = pageSize === 99;
        const pageLimit = isAll ? 0 : parseInt(pageSize, 10);  // If 'All', set pageLimit to 0 (no limit)
        const skip = isAll ? 0 : (pageNumber - 1) * pageLimit; // If 'All', skip nothing

        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let SeachQry = { masterid: req.query.masterid, del: "N" };

        if (seacrhString) {
            SeachQry.$or = [
                { ACName: regex },
                { MobileNo: regex },
                { bankName: regex },
            ];
        }

        const qry = { masterid: req.query.masterid, del: "N" };
        const Totalqry = { masterid: req.query.masterid, del: "N" };
        if (seacrhString) {
            const designation = await accountSchema.find(SeachQry);
            const designationarr = designation.map(d => d._id);

            const bankFind = await bankSchema.find(SeachQry);
            const bankArr = bankFind.map(d => d._id);

            // qry.Applicant = { $in: designationarr }

            if (designation.length > 0 || bankArr.length > 0) {
                qry.$or = [
                    { Applicant: { $in: designationarr } },
                    { Dealer: { $in: designationarr } },
                    { Executive: { $in: designationarr } },
                    // { Disbursement_dealer: { $in: designationarr } },
                    { bank: { $in: bankArr } },
                ];
            }
            else {
                qry.$or = [
                    { VehicleNo: regex },
                ];
            }
        }

        if (req.query.empSubEx) {
            qry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_subExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) }
            ];
            Totalqry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_subExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) }
            ];
        }
        if (req.query.stage) {
            qry.stage = req.query.stage;
            Totalqry.stage = req.query.stage;
            if (req.query.stage === 'Login') {
                qry.date = { $gte: startDate, $lt: endDate };
                Totalqry.date = { $gte: startDate, $lt: endDate };
            } else {
                qry[`${req.query.stage}_date`] = { $gte: startDate, $lt: endDate };
                Totalqry[`${req.query.stage}_date`] = { $gte: startDate, $lt: endDate };
            }
        } else {
            // qry.stage = { $nin: ['Login', 'Disbursement', 'Cancelled', 'Reject'] };
            qry.stage = { $nin: ['Disbursement', 'Cancelled', 'Reject'] };
            qry.date = { $gte: startDate, $lt: endDate };
            // Totalqry.stage = { $nin: ['Login', 'Disbursement', 'Cancelled', 'Reject'] };
            Totalqry.stage = { $nin: ['Disbursement', 'Cancelled', 'Reject'] };
            Totalqry.date = { $gte: startDate, $lt: endDate };
        }
        console.log(qry, 'qry');

        if (req.query.stage === 'Login') {
            var lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                // { $sort: { entry: -1 } },
                { $sort: { date: -1 } },
                { $skip: req.query.pageSize == 99 ? 0 : skip },
                { $limit: req.query.pageSize == 99 ? 500 : pageLimit }
            ]);
        }
        else {
            var lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $sort: { [`${req.query.stage}_date`]: -1 } },
                { $skip: req.query.pageSize == 99 ? 0 : skip },
                { $limit: req.query.pageSize == 99 ? 500 : pageLimit }
            ]);
        }

        const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
            { path: 'bank', select: 'bankName' },
            { path: 'firm', select: 'div_mast' },
            { path: 'bank2', select: 'bankName' },
            { path: 'firm2', select: 'div_mast' },
            { path: 'Applicant', select: 'ACName MobileNo PanNumber', populate: { path: 'CityName', select: 'CityName' } }, // Populate CityName reference
            { path: 'CoApplicant', select: 'ACName' },
            { path: 'Guranter', select: 'cutomer_name' },
            { path: 'Make', select: 'Description' },
            { path: 'Model', select: 'Description' },
            { path: 'Variant', select: 'Description' },
            { path: 'Executive', select: 'ACName' },
            { path: 'SubExecutive', select: 'ACName' },
            { path: 'Dealer', select: 'ACName PanNumber' },
            { path: 'SubDealer', select: 'ACName' },
            { path: 'Disbursement_loanType', select: 'CustomerCategory' }
        ]);

        const totalDocuments = await CustomerApplicationSchema.countDocuments(qry);

        const result = await CustomerApplicationSchema.aggregate([
            { $match: Totalqry },  // Match the masterid and del field
            { $group: { _id: "$stage", count: { $sum: 1 } } },  // Group by stage and count occurrences
            { $sort: { count: -1 } }  // Sort by the count (optional)
        ]);

        res.json({ lastEntryNo: populatedEntries, totalDocuments, datas: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerApplicationsListGET = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, seacrhString } = req.query;  // Default values
        const pageNumber = parseInt(page, 10);
        const regex = new RegExp(seacrhString, 'i'); // Create a case-insensitive regex

        const isAll = pageSize === 99;
        const pageLimit = isAll ? 0 : parseInt(pageSize, 10);  // If 'All', set pageLimit to 0 (no limit)
        const skip = isAll ? 0 : (pageNumber - 1) * pageLimit; // If 'All', skip nothing

        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let SeachQry = { masterid: req.query.masterid, del: "N" };

        if (seacrhString) {
            SeachQry.$or = [
                { ACName: regex },
                { MobileNo: regex },
                // { PanNumber: regex },
                // { bankName: regex },
            ];
        }

        const qry = { masterid: req.query.masterid, del: "N" };
        const Totalqry = { masterid: req.query.masterid, del: "N" };
        // if (seacrhString) {
        //     const designation = await accountSchema.find(SeachQry);
        //     const designationarr = designation.map(d => d._id);
        //     qry.Applicant = { $in: designationarr }
        // }

        if (seacrhString) {
            const designation = await accountSchema.find(SeachQry);
            const designationarr = designation.map(d => d._id);
            // qry.Applicant = { $in: designationarr }
            if (designation.length > 0) {
                qry.$or = [
                    { Applicant: { $in: designationarr } },
                ];
            }
            else {
                qry.$or = [
                    { VehicleNo: regex },

                ];
            }
        }

        if (req.query.empSubEx) {
            qry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_subExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) }
            ];
            Totalqry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_subExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) }
            ];
        }

        // qry.stage = { $nin: ['Login', 'Disbursement', 'Cancelled', 'Reject'] };
        qry.date = { $gte: startDate, $lt: endDate };
        // Totalqry.stage = { $nin: ['Login', 'Disbursement', 'Cancelled', 'Reject'] };
        Totalqry.date = { $gte: startDate, $lt: endDate };

        var lastEntryNo = await CustomerApplicationSchema.aggregate([
            { $match: qry },
            { $sort: { date: -1 } },
            { $skip: req.query.pageSize == 99 ? 0 : skip },
            { $limit: req.query.pageSize == 99 ? 500 : pageLimit }
        ]);


        const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
            { path: 'bank', select: 'bankName' },
            { path: 'firm', select: 'div_mast' },
            { path: 'bank2', select: 'bankName' },
            { path: 'firm2', select: 'div_mast' },
            { path: 'Applicant', select: 'ACName MobileNo PanNumber', populate: { path: 'CityName', select: 'CityName' } }, // Populate CityName reference
            { path: 'CoApplicant', select: 'ACName' },
            { path: 'Guranter', select: 'cutomer_name' },
            { path: 'Make', select: 'Description' },
            { path: 'Model', select: 'Description' },
            { path: 'Variant', select: 'Description' },
            { path: 'Executive', select: 'ACName' },
            { path: 'SubExecutive', select: 'ACName' },
            { path: 'Dealer', select: 'ACName PanNumber' },
            { path: 'SubDealer', select: 'ACName' },
            { path: 'SoftApproval_bank', select: 'bankName' },
            { path: 'SoftApproval_firm', select: 'div_mast' },
            { path: 'Approved_bank', select: 'bankName' },
            { path: 'Approved_firm', select: 'div_mast' },
            { path: 'UnderDisbursement_bank', select: 'bankName' },
            { path: 'UnderDisbursement_firm', select: 'div_mast' },

            { path: 'Disbursement_bank', select: 'bankName' },
            { path: 'Disbursement_firm', select: 'div_mast' },
            { path: 'Disbursement_loanCreditAC', select: 'ACName' },
            { path: 'Disbursement_loanType', select: 'CustomerCategory' },
            { path: 'Disbursement_dealer', select: 'ACName' },
            { path: 'Disbursement_executive', select: 'ACName' },
            { path: 'Disbursement_subExecutive', select: 'ACName' },

        ]);

        const totalDocuments = await CustomerApplicationSchema.countDocuments(qry);

        const result = await CustomerApplicationSchema.aggregate([
            { $match: Totalqry },  // Match the masterid and del field
            { $group: { _id: "$stage", count: { $sum: 1 } } },  // Group by stage and count occurrences
            { $sort: { count: -1 } }  // Sort by the count (optional)
        ]);

        res.json({ lastEntryNo: populatedEntries, totalDocuments, datas: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerApplicationGET2 = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, seacrhString } = req.query;  // Default values
        const pageNumber = parseInt(page, 10);
        const regex = new RegExp(seacrhString, 'i'); // Create a case-insensitive regex

        const isAll = pageSize === 99;
        const pageLimit = isAll ? 0 : parseInt(pageSize, 10);  // If 'All', set pageLimit to 0 (no limit)
        const skip = isAll ? 0 : (pageNumber - 1) * pageLimit; // If 'All', skip nothing

        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let SeachQry = { masterid: req.query.masterid, del: "N" };

        if (seacrhString) {
            SeachQry.$or = [
                { ACName: regex },
                { MobileNo: regex },
                { PanNumber: regex },
                { bankName: regex },
            ];
        }

        const qry = { masterid: req.query.masterid, del: "N" };
        const Totalqry = { masterid: req.query.masterid, del: "N" };

        if (seacrhString) {

            if (req.query.stage === 'Login' || req.query.stage === 'Cancelled' || req.query.stage === 'Reject') {
                const designation = await accountSchema.find(SeachQry);
                const designationarr = designation.map(d => d._id);

                const bankFind = await bankSchema.find(SeachQry);
                const bankArr = bankFind.map(d => d._id);
                // qry.Applicant = { $in: designationarr }
                if (designation.length > 0 || bankArr.length > 0) {
                    qry.$or = [
                        { Applicant: { $in: designationarr } },
                        { Dealer: { $in: designationarr } },
                        { Executive: { $in: designationarr } },
                        // { Disbursement_dealer: { $in: designationarr } },
                        { bank: { $in: bankArr } },
                    ];
                }
                else {
                    qry.$or = [
                        { VehicleNo: regex },
                    ];
                }
            }
            else {
                const designation = await accountSchema.find(SeachQry);
                const designationarr = designation.map(d => d._id);

                const bankFind = await bankSchema.find(SeachQry);
                const bankArr = bankFind.map(d => d._id);
                // qry.Applicant = { $in: designationarr }
                if (designation.length > 0 || bankArr.length > 0) {
                    qry.$or = [
                        { Applicant: { $in: designationarr } },
                        { Disbursement_dealer: { $in: designationarr } },
                        { Disbursement_executive: { $in: designationarr } },
                        { Disbursement_dealer: { $in: designationarr } },
                        { Disbursement_bank: { $in: bankArr } },
                    ];
                }
                else {
                    qry.$or = [
                        { VehicleNo: regex },
                        { Disbursement_commPaid: regex },
                        { Disbursement_commReceived: regex },
                    ];
                }
            }
        }

        if (req.query.empSubEx) {
            qry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_subExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) }
            ];
            Totalqry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { Disbursement_subExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) }
            ];
        }
        if (req.query.stage) {
            qry.stage = req.query.stage;
            Totalqry.stage = req.query.stage;
            if (req.query.stage === 'Login') {
                qry.date = { $gte: startDate, $lt: endDate };
                Totalqry.date = { $gte: startDate, $lt: endDate };
            } else {
                qry[`${req.query.stage}_date`] = { $gte: startDate, $lt: endDate };
                Totalqry[`${req.query.stage}_date`] = { $gte: startDate, $lt: endDate };
            }
        } else {
            qry.stage = { $nin: ['Login', 'Disbursement', 'Cancelled', 'Reject'] };
            qry.date = { $gte: startDate, $lt: endDate };
            Totalqry.stage = { $nin: ['Login', 'Disbursement', 'Cancelled', 'Reject'] };
            Totalqry.date = { $gte: startDate, $lt: endDate };
        }

        if (req.query.stage === 'Login') {
            var lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                // { $sort: { entry: -1 } },
                { $sort: { date: -1 } },
                { $skip: req.query.pageSize == 99 ? 0 : skip },
                { $limit: req.query.pageSize == 99 ? 500 : pageLimit }
            ]);
        }
        else {
            var lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $sort: { [`${req.query.stage}_date`]: -1 } },
                { $skip: req.query.pageSize == 99 ? 0 : skip },
                { $limit: req.query.pageSize == 99 ? 500 : pageLimit }
            ]);
        }

        const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
            { path: 'bank', select: 'bankName' },
            { path: 'firm', select: 'div_mast' },
            { path: 'bank2', select: 'bankName' },
            { path: 'firm2', select: 'div_mast' },
            { path: 'Disbursement_bank', select: 'bankName' },
            { path: 'Applicant', select: 'ACName MobileNo PanNumber', populate: [{ path: 'CityName', select: 'CityName' }, { path: 'cutomer_category', select: 'CustomerCategory' }] }, // Populate CityName reference
            { path: 'CoApplicant', select: 'ACName' },
            { path: 'Guranter', select: 'cutomer_name' },
            { path: 'Make', select: 'Description' },
            { path: 'Model', select: 'Description' },
            { path: 'Variant', select: 'Description' },
            { path: 'Executive', select: 'ACName' },
            { path: 'SubExecutive', select: 'ACName' },
            { path: 'Dealer', select: 'ACName PanNumber' },
            { path: 'SubDealer', select: 'ACName' },
            { path: 'Disbursement_loanType', select: 'CustomerCategory' }
        ]);

        const totalDocuments = await CustomerApplicationSchema.countDocuments(qry);

        const totals = await CustomerApplicationSchema.aggregate([
            { $match: Totalqry },
            {
                $addFields: {
                    Disbursement_loanAmount: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_loanAmount", ""] }, { $ne: ["$Disbursement_loanAmount", null] }] },
                            then: { $toDouble: "$Disbursement_loanAmount" },
                            else: 0
                        }
                    },
                    grossCosReceived: {
                        $cond: {
                            if: { $and: [{ $ne: ["$grossCosReceived", ""] }, { $ne: ["$grossCosReceived", null] }] },
                            then: { $toDouble: "$grossCosReceived" },
                            else: 0
                        }
                    },
                    Disbursement_netComReceived: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_netComReceived", ""] }, { $ne: ["$Disbursement_netComReceived", null] }] },
                            then: { $toDouble: "$Disbursement_netComReceived" },
                            else: 0
                        }
                    },
                    Disbursement_commAmount: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_commAmount", ""] }, { $ne: ["$Disbursement_commAmount", null] }] },
                            then: { $toDouble: "$Disbursement_commAmount" },
                            else: 0
                        }
                    },
                    Disbursement_executiveComRupees: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_executiveComRupees", ""] }, { $ne: ["$Disbursement_executiveComRupees", null] }] },
                            then: { $toDouble: "$Disbursement_executiveComRupees" },
                            else: 0
                        }
                    },
                    Disbursement_subExecutiveComRupees: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_subExecutiveComRupees", ""] }, { $ne: ["$Disbursement_subExecutiveComRupees", null] }] },
                            then: { $toDouble: "$Disbursement_subExecutiveComRupees" },
                            else: 0
                        }
                    },
                    Disbursement_netRemainingAmount: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_netRemainingAmount", ""] }, { $ne: ["$Disbursement_netRemainingAmount", null] }] },
                            then: { $toDouble: "$Disbursement_netRemainingAmount" },
                            else: 0
                        }
                    },
                    Disbursement_rto: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_rto", ""] }, { $ne: ["$Disbursement_rto", null] }] },
                            then: { $toDouble: "$Disbursement_rto" },
                            else: 0
                        }
                    },
                    Disbursement_netBankAmountReceived: {
                        $cond: {
                            if: { $and: [{ $ne: ["$Disbursement_netBankAmountReceived", ""] }, { $ne: ["$Disbursement_netBankAmountReceived", null] }] },
                            then: { $toDouble: "$Disbursement_netBankAmountReceived" },
                            else: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    entries: { $sum: 1 },
                    totalLoanAmount: { $sum: "$Disbursement_loanAmount" },
                    payoutReceived: { $sum: "$grossCosReceived" },
                    netPayout: { $sum: "$Disbursement_netComReceived" },
                    payoutAmountDealer: { $sum: "$Disbursement_commAmount" },
                    executivePayout: { $sum: "$Disbursement_executiveComRupees" },
                    subExecutivePayout: { $sum: "$Disbursement_subExecutiveComRupees" },
                    remainingPayout: { $sum: "$Disbursement_netRemainingAmount" },
                    rtoAmount: { $sum: "$Disbursement_rto" },
                    netBankAmountReceived: { $sum: "$Disbursement_netBankAmountReceived" }
                }
            }
        ]);


        res.json({ lastEntryNo: populatedEntries, totalDocuments, totals: totals[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CustomerApplicationDocumentsUpdate = async (req, res) => {
    try {
        const { _id, documents, user } = req.body;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        await CustomerApplicationSchema.updateOne({ _id: _id }, { $set: { documents: documents, update: userDateObject, update_datemilisecond: entrydatemilisecond, } });

        // Log the user activity
        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'CustomerApplicationSchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        res.status(200).json({ status: true, message: "Documents updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

exports.CustomerApplicationDocumentsGet = async (req, res) => {
    try {
        const qry = { _id: new mongoose.Types.ObjectId(req.body._id) };
        const document = await CustomerApplicationSchema.findOne(qry, 'documents');
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const parsedDocuments = JSON.parse(document.documents);
        res.json({ documents: parsedDocuments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Stages
exports.Stage_Update = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        if (req.body.stage === "Login") {
            const newState = {
                stage: req.body.stage,
                Login_remark: req.body.remark,

                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);
        }

        if (req.body.stage === "SoftApproval") {
            const newState = {
                stage: req.body.stage,
                SoftApproval_bank: req.body.bank,
                SoftApproval_firm: req.body.firm,
                SoftApproval_crcc: req.body.crcc,
                SoftApproval_date: moment(req.body.date).tz("Asia/Kolkata"),
                SoftApproval_date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                SoftApproval_Amount: req.body.amount,
                SoftApproval_Tenure: req.body.tenureDurationMonth,
                SoftApproval_remark: req.body.remarks,

                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);
        }

        if (req.body.stage === "Reject") {
            const newState = {
                stage: req.body.stage,
                Reject_date: moment(req.body.date).tz("Asia/Kolkata"),
                Reject_date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                Reject_query: req.body.query,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);
        }

        if (req.body.stage === "Cancelled") {
            const newState = {
                stage: req.body.stage,
                Cancelled_date: moment(req.body.date).tz("Asia/Kolkata"),
                Cancelled_date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                Cancelled_query: req.body.query,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);
        }

        if (req.body.stage === "Approved") {
            const newState = {
                stage: req.body.stage,
                Approved_bank: req.body.bank,
                Approved_firm: req.body.firm,
                Approved_crcc: req.body.crcc,
                Approved_date: moment(req.body.date).tz("Asia/Kolkata"),
                Approved_date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                Approved_Amount: req.body.amount,
                Approved_Tenure: req.body.tenureDurationMonth,
                Approved_remark: req.body.remarks,

                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);
        }

        if (req.body.stage === "UnderDisbursement") {
            const newState = {
                stage: req.body.stage,
                UnderDisbursement_bank: req.body.bank,
                UnderDisbursement_firm: req.body.firm,
                UnderDisbursement_crcc: req.body.crcc,
                UnderDisbursement_Query: req.body.Query,
                UnderDisbursement_Interest: req.body.Interest,
                UnderDisbursement_EMI: req.body.EMI,

                UnderDisbursement_date: moment(req.body.date).tz("Asia/Kolkata"),
                UnderDisbursement_date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                UnderDisbursement_Amount: req.body.amount,
                UnderDisbursement_Tenure: req.body.tenureDurationMonth,

                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);
        }

        if (req.body.stage === "Disbursement") {
            const newState = {
                stage: req.body.stage,
                Disbursement_date: moment(req.body.date).tz("Asia/Kolkata"),
                Disbursement_date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                Disbursement_bank: req.body.bank,
                Disbursement_PendingbankAmount: req.body.Pendingbankamount,
                Disbursement_firm: req.body.firm,
                Disbursement_loanAmount: req.body.loanAmount,
                Disbursement_tenure: req.body.tenure,
                Disbursement_rate: req.body.rate,
                Disbursement_emi: req.body.emi,
                Disbursement_emiStartDate: moment(req.body.emiStartDate).tz("Asia/Kolkata"),
                Disbursement_emiStartDate_datemilisecond: moment(req.body.emiStartDate).tz("Asia/Kolkata").format('x'),
                Disbursement_pf: req.body.pf,
                Disbursement_stamp: req.body.stamp,
                Disbursement_installment: req.body.installment,
                Disbursement_mi: req.body.mi,
                Disbursement_sk: req.body.sk,
                Disbursement_other: req.body.other,
                Disbursement_netBankAmountReceived: req.body.netBankAmountReceived,
                Disbursement_rto: req.body.rto,
                Disbursement_other1: req.body.other1,
                Disbursement_netPaidToDealer: req.body.netPaidToDealer,
                Disbursement_loanCreditAC: req.body.loanCreditAC,
                Disbursement_loanType: req.body.loanType,
                Disbursement_payOutPercentage: req.body.payOutPercentage,
                Disbursement_grossCosReceived: req.body.grossCosReceived,
                Disbursement_tdsPercentage: req.body.tdsPercentage,
                Disbursement_gstPercentage: req.body.gstPercentage,
                Disbursement_netComReceived: req.body.netComReceived,
                Disbursement_dealer: req.body.dealer,
                Disbursement_commPercentage: req.body.commPercentage,
                Disbursement_commAmount: req.body.commAmount,
                Disbursement_executive: req.body.executive,
                Disbursement_executiveComRupees: req.body.executiveComRupees,
                Disbursement_subExecutive: req.body.subExecutive,
                Disbursement_subExecutiveComRupees: req.body.subExecutiveComRupees,
                Disbursement_netRemainingAmount: req.body.netRemainingAmount,
                Disbursement_remark: req.body.remark,
                Disbursement_commPaid: req.body.commPaid,
                Disbursement_commReceived: req.body.commReceived,
                remark1: req.body.remark1,
                remark2: req.body.remark2,
                newBank: req.body.newBank,
                newAccNo: req.body.newAccNo,
                newBranch: req.body.newBranch,
                newIFSCCode: req.body.newIFSCCode,
                Disbursement_BankLimit: req.body.BankLimit,

                VehicleNo: req.body.VehicleNo,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);

            // transSchema update 
            const findData = await CustomerApplicationSchema.findOne({
                _id: new mongoose.Types.ObjectId(req.body._id)
            })
                .select('VehicleNo Applicant Disbursement_bank')
                .populate({
                    path: 'Applicant',
                    select: 'ACName'
                });

            // Bank Debit  ----------------------------
            const findBankLoanDebit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.loanCreditAC),
                type: 'Loan Entry',
                // type: 'Receipt',
                d_c: 'Debit',
            });

            if (!findBankLoanDebit && req.body.loanCreditAC && Number(req.body.netBankAmountReceived)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = req.body.loanCreditAC;
                state_mast.cashoppac_name = req.body.ApplicantID;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = "JR";
                state_mast.type = "Loan Entry";
                state_mast.d_c = "Debit";
                state_mast.srno = 1;
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.netBankAmountReceived);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findBankLoanDebit) {
                const updateTrans = {
                    cashac_name: req.body.loanCreditAC,
                    srno: 1,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.netBankAmountReceived),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), d_c: 'Debit', type: 'Loan Entry', }, updateTrans);
            }

            // Applicant Credit  ----------------------------
            const findApplicantLoanCredit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'Loan Entry',
                // type: 'Receipt',
                d_c: 'Credit',
                srno: 1
            });

            if (!findApplicantLoanCredit && req.body.ApplicantID && Number(req.body.netBankAmountReceived)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = req.body.ApplicantID;
                state_mast.cashoppac_name = req.body.loanCreditAC;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "Loan Entry";
                state_mast.d_c = "Credit";
                state_mast.Dealer_name = req.body.dealer;
                // state_mast.type = "Receipt";
                state_mast.srno = 1;
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.netBankAmountReceived);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findApplicantLoanCredit) {
                const updateTrans = {
                    cashac_name: req.body.ApplicantID,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.netBankAmountReceived),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    Dealer_name: req.body.dealer,
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), d_c: 'Credit', type: 'Loan Entry', }, updateTrans);
            }

            // RTO Credit ----------------------------

            const RTOAccount = await accountSetupSchema.findOne({ group: 'RTO', user: req.body.masterid });
            const RTOExpenseAccount = await expenseSchema.findOne({ HeadName: 'RTO', masterid: req.body.masterid });

            const findRTO = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'RTO',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findRTO && RTOAccount?.garry && Number(req.body.rto)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = RTOAccount?.garry;
                state_mast.cashoppac_name = req.body.ApplicantID;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "RTO";
                state_mast.expense = RTOExpenseAccount?._id;
                state_mast.srno = 2;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.rto);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findRTO) {
                const updateTrans = {
                    cashac_name: RTOAccount?.garry,
                    srno: 2,
                    expense: RTOExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.rto),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'RTO', }, updateTrans);
            }

            // RTO Debit ----------------------------

            const findRTODebit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'RTO',
                // type: 'Receipt',
            });

            if (!findRTODebit && req.body.ApplicantID && Number(req.body.rto)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = req.body.ApplicantID;
                state_mast.cashoppac_name = RTOAccount?.garry;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "RTO";
                state_mast.expense = RTOExpenseAccount?._id;
                state_mast.srno = 2;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.rto);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findRTODebit) {
                const updateTrans = {
                    cashac_name: req.body.ApplicantID,
                    srno: 2,
                    expense: RTOExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.rto),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), type: 'RTO', cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID) }, updateTrans);
            }

            // OTHER Credit  ----------------------------

            const OtherAccount = await accountSetupSchema.findOne({ group: 'OTHER', user: req.body.masterid });
            const OtherExpenseAccount = await expenseSchema.findOne({ HeadName: 'OTHER', masterid: req.body.masterid });

            const findOther = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'OTHER',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findOther && OtherAccount?.garry && Number(req.body.other1)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = OtherAccount?.garry;
                state_mast.cashoppac_name = req.body.ApplicantID;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "OTHER";
                state_mast.expense = OtherExpenseAccount?._id;
                state_mast.srno = 3;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.other1);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findOther) {
                const updateTrans = {
                    cashac_name: OtherAccount?.garry,
                    srno: 3,
                    expense: OtherExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.other1),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'OTHER', }, updateTrans);
            }

            // Other Debit ----------------------------

            const findDebitOther = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'OTHER',
                // type: 'Receipt',
            });

            if (!findDebitOther && req.body.ApplicantID && Number(req.body.other1)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = req.body.ApplicantID;
                state_mast.cashoppac_name = OtherAccount?.garry;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "OTHER";
                state_mast.expense = OtherExpenseAccount?._id;
                state_mast.srno = 3;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.other1);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findDebitOther) {
                const updateTrans = {
                    cashac_name: req.body.ApplicantID,
                    srno: 3,
                    expense: OtherExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.other1),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), type: 'OTHER', cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID) }, updateTrans);
            }


            // Gross Cos Received  Credit----------------------------
            const COMMISSIONAccount = await accountSetupSchema.findOne({ group: 'COMMISSION', user: req.body.masterid });
            const COMMISSIONExpenseAccount = await expenseSchema.findOne({ HeadName: 'COMMISSION', masterid: req.body.masterid });
            const ApplicantAccountData = await CustomerApplicationSchema.findOne({ _id: req.body._id });
            const BankLinkAccount = await bankSchema.findOne({ _id: ApplicantAccountData?.Disbursement_bank });

            const findGrossCOMMISSION = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'COMMISSION',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findGrossCOMMISSION && COMMISSIONAccount?.garry && Number(req.body.grossCosReceived)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = COMMISSIONAccount?.garry;
                state_mast.cashoppac_name = BankLinkAccount?.limitAccount;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "COMMISSION";
                state_mast.expense = COMMISSIONExpenseAccount?._id;
                state_mast.srno = 4;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.grossCosReceived);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findGrossCOMMISSION) {
                const updateTrans = {
                    cashac_name: COMMISSIONAccount?.garry,
                    cashoppac_name: BankLinkAccount?.limitAccount,
                    srno: 4,
                    expense: COMMISSIONExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.grossCosReceived),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'COMMISSION', }, updateTrans);
            }

            // Gross Cos Received  Debit----------------------------

            const findDebitGrossCOMMISSION = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'COMMISSION',
                // type: 'Receipt',
                d_c: 'Debit'
            });

            if (!findDebitGrossCOMMISSION && COMMISSIONAccount?.garry && Number(req.body.grossCosReceived)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = BankLinkAccount?.limitAccount;
                state_mast.cashoppac_name = COMMISSIONAccount?.garry;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "COMMISSION";
                state_mast.expense = OtherExpenseAccount?._id;
                state_mast.srno = 4;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.grossCosReceived);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findDebitGrossCOMMISSION) {
                const updateTrans = {
                    cashac_name: BankLinkAccount?.limitAccount,
                    cashoppac_name: COMMISSIONAccount?.garry,
                    srno: 4,
                    expense: OtherExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.grossCosReceived),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), type: 'COMMISSION', d_c: 'Debit' }, updateTrans);
            }

            // GST  Credit----------------------------
            const GSTAccount = await accountSetupSchema.findOne({ group: 'GST', user: req.body.masterid });
            const GSTExpenseAccount = await expenseSchema.findOne({ HeadName: 'GST', masterid: req.body.masterid });

            const findGrossGST = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'GST',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findGrossGST && GSTAccount?.garry && Number(req.body.grossCosReceived) && Number(req.body.gstPercentage)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = GSTAccount?.garry;
                state_mast.cashoppac_name = BankLinkAccount?.limitAccount;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "GST";
                state_mast.expense = GSTExpenseAccount?._id;
                state_mast.srno = 5;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.grossCosReceived) * Number(req.body.gstPercentage) / 100;
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findGrossGST) {
                const updateTrans = {
                    cashac_name: GSTAccount?.garry,
                    cashoppac_name: BankLinkAccount?.limitAccount,
                    srno: 5,
                    expense: GSTExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.grossCosReceived) * Number(req.body.gstPercentage) / 100,
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'GST', }, updateTrans);
            }

            // GST  Debit----------------------------

            const findDebitGrossGST = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'GST',
                // type: 'Receipt',
                d_c: 'Debit'
            });

            if (!findDebitGrossGST && GSTAccount?.garry && Number(req.body.grossCosReceived) && Number(req.body.gstPercentage)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = BankLinkAccount?.limitAccount;
                state_mast.cashoppac_name = GSTAccount?.garry;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "GST";
                state_mast.expense = OtherExpenseAccount?._id;
                state_mast.srno = 5;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.grossCosReceived) * Number(req.body.gstPercentage) / 100;
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findDebitGrossGST) {
                const updateTrans = {
                    cashac_name: BankLinkAccount?.limitAccount,
                    cashoppac_name: GSTAccount?.garry,
                    srno: 5,
                    expense: OtherExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.grossCosReceived) * Number(req.body.gstPercentage) / 100,
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), type: 'GST', d_c: 'Debit' }, updateTrans);
            }

            // Dealer ------------------------------
            // const findDealer = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     cashac_name: new mongoose.Types.ObjectId(req.body.dealer),
            //     type: 'XDL',
            //     // type: 'Receipt',
            // });

            // if (!findDealer && req.body.dealer && Number(req.body.commAmount)) {
            //     let state_mast = new transSchema();
            //     state_mast.application_id = req.body._id;
            //     state_mast.cashac_name = req.body.dealer;
            //     state_mast.main_bk = 'JR';
            //     state_mast.c_j_s_p = 'JR';
            //     state_mast.type = "XDL";
            //     state_mast.d_c = "Credit";
            //     // state_mast.type = "Receipt";
            //     state_mast.srno = 5;
            //     state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
            //     state_mast.cash_amount = Number(req.body.commAmount);
            //     state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            //     state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            //     state_mast.masterid = req.body.masterid;
            //     state_mast.co_code = req.body.compid;
            //     state_mast.div_code = req.body.divid;
            //     await state_mast.save();
            // }

            // if (findDealer) {
            //     const updateTrans = {
            //         cashac_name: req.body.dealer,
            //         srno: 5,
            //         narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
            //         cash_amount: Number(req.body.commAmount),
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), cashac_name: new mongoose.Types.ObjectId(req.body.dealer), type: 'XDL', }, updateTrans);
            // }

            // Executive  ----------------------------

            // TDS  Credit----------------------------
            const TDSAccount = await accountSetupSchema.findOne({ group: 'TDS', user: req.body.masterid });
            const TDSExpenseAccount = await expenseSchema.findOne({ HeadName: 'TDS', masterid: req.body.masterid });

            const findGrossTDS = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'TDS',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findGrossTDS && TDSAccount?.garry && Number(req.body.grossCosReceived) && Number(req.body.tdsPercentage)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = TDSAccount?.garry;
                state_mast.cashoppac_name = BankLinkAccount?.limitAccount;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "TDS";
                state_mast.expense = TDSExpenseAccount?._id;
                state_mast.srno = 6;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.grossCosReceived) * Number(req.body.tdsPercentage) / 100;
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findGrossTDS) {
                const updateTrans = {
                    cashac_name: TDSAccount?.garry,
                    cashoppac_name: BankLinkAccount?.limitAccount,
                    srno: 6,
                    expense: TDSExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.grossCosReceived) * Number(req.body.tdsPercentage) / 100,
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'TDS', }, updateTrans);
            }

            // TDS  Debit----------------------------

            const findDebitGrossTDS = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'TDS',
                // type: 'Receipt',
                d_c: 'Debit'
            });

            if (!findDebitGrossTDS && TDSAccount?.garry && Number(req.body.grossCosReceived) && Number(req.body.tdsPercentage)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = BankLinkAccount?.limitAccount;
                state_mast.cashoppac_name = TDSAccount?.garry;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "TDS";
                state_mast.expense = OtherExpenseAccount?._id;
                state_mast.srno = 6;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.grossCosReceived) * Number(req.body.tdsPercentage) / 100;
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findDebitGrossTDS) {
                const updateTrans = {
                    cashac_name: BankLinkAccount?.limitAccount,
                    cashoppac_name: TDSAccount?.garry,
                    srno: 6,
                    expense: OtherExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.grossCosReceived) * Number(req.body.tdsPercentage) / 100,
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), type: 'TDS', d_c: 'Debit' }, updateTrans);
            }

            // const findExecutive = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     cashac_name: new mongoose.Types.ObjectId(req.body.executive),
            //     type: 'XEX',
            //     // type: 'Receipt',
            // });

            // if (!findExecutive && req.body.executive && Number(req.body.executiveComRupees)) {
            //     let state_mast = new transSchema();
            //     state_mast.application_id = req.body._id;
            //     state_mast.cashac_name = req.body.executive;
            //     state_mast.main_bk = 'JR';
            //     state_mast.c_j_s_p = 'JR';
            //     state_mast.type = "XEX";
            //     state_mast.srno = 6;
            //     state_mast.d_c = "Credit";
            //     // state_mast.type = "Receipt";
            //     state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
            //     state_mast.cash_amount = Number(req.body.executiveComRupees);
            //     state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            //     state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            //     state_mast.masterid = req.body.masterid;
            //     state_mast.co_code = req.body.compid;
            //     state_mast.div_code = req.body.divid;
            //     await state_mast.save();
            // }

            // if (findExecutive) {
            //     const updateTrans = {
            //         cashac_name: req.body.executive,
            //         srno: 6,
            //         narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
            //         cash_amount: Number(req.body.executiveComRupees),
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), cashac_name: new mongoose.Types.ObjectId(req.body.executive), type: 'XEX', }, updateTrans);
            // }

            // Dealer Credit ----------------------------

            const DealerAccount = await accountSetupSchema.findOne({ group: 'PAY OUT DEALER', user: req.body.masterid });
            const DealerExpenseAccount = await expenseSchema.findOne({ HeadName: 'PAY OUT DEALER', masterid: req.body.masterid });

            const findDealerCredit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'PAY OUT DEALER',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findDealerCredit && DealerAccount?.garry && Number(req.body.commAmount)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = DealerAccount?.garry;
                state_mast.cashoppac_name = BankLinkAccount?.limitAccount;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "PAY OUT DEALER";
                state_mast.expense = DealerExpenseAccount?._id;
                state_mast.srno = 7;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.commAmount);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findDealerCredit) {
                const updateTrans = {
                    cashac_name: DealerAccount?.garry,
                    cashoppac_name: BankLinkAccount?.limitAccount,
                    srno: 7,
                    expense: DealerExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.commAmount),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'PAY OUT DEALER', }, updateTrans);
            }

            // Dealer Debit ----------------------------

            const findDealerDebit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'PAY OUT DEALER',
                d_c: 'Debit',
                // type: 'Receipt',
            });

            if (!findDealerDebit && DealerAccount?.garry && Number(req.body.commAmount)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = BankLinkAccount?.limitAccount;
                state_mast.cashoppac_name = DealerAccount?.garry;

                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "PAY OUT DEALER";
                state_mast.expense = DealerExpenseAccount?._id;
                state_mast.srno = 7;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.commAmount);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findDealerDebit) {
                const updateTrans = {
                    cashac_name: BankLinkAccount?.limitAccount,
                    cashoppac_name: DealerAccount?.garry,
                    srno: 7,
                    expense: DealerExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.commAmount),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Debit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'PAY OUT DEALER', }, updateTrans);
            }

            // Executive Credit ----------------------------

            const ExecutiveAccount = await accountSetupSchema.findOne({ group: 'PAY OUT EXECUTIVE', user: req.body.masterid });
            const ExecutiveExpenseAccount = await expenseSchema.findOne({ HeadName: 'PAY OUT EXECUTIVE', masterid: req.body.masterid });

            const findExecutiveCredit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
                type: 'PAY OUT EXECUTIVE',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findExecutiveCredit && ExecutiveAccount?.garry && Number(req.body.executiveComRupees)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = ExecutiveAccount?.garry;
                state_mast.cashoppac_name = BankLinkAccount?.limitAccount;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "PAY OUT EXECUTIVE";
                state_mast.expense = ExecutiveExpenseAccount?._id;
                state_mast.srno = 8;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.executiveComRupees);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findExecutiveCredit) {
                const updateTrans = {
                    cashac_name: ExecutiveAccount?.garry,
                    cashoppac_name: BankLinkAccount?.limitAccount,
                    srno: 8,
                    expense: ExecutiveExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.executiveComRupees),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'PAY OUT EXECUTIVE', }, updateTrans);
            }

            // Executive Debit ----------------------------

            const findExecutiveDebit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'PAY OUT EXECUTIVE',
                // type: 'Receipt',
                d_c: 'Debit',
            });

            if (!findExecutiveDebit && ExecutiveAccount?.garry && Number(req.body.executiveComRupees)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = BankLinkAccount?.limitAccount;
                state_mast.cashoppac_name = ExecutiveAccount?.garry;

                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "PAY OUT EXECUTIVE";
                state_mast.expense = ExecutiveExpenseAccount?._id;
                state_mast.srno = 8;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.executiveComRupees);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findExecutiveDebit) {
                const updateTrans = {
                    cashac_name: BankLinkAccount?.limitAccount,
                    cashoppac_name: ExecutiveAccount?.garry,
                    srno: 8,
                    expense: ExecutiveExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.executiveComRupees),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Debit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'PAY OUT EXECUTIVE', }, updateTrans);
            }

            // SubExecutive Credit ----------------------------

            const SubExecutiveAccount = await accountSetupSchema.findOne({ group: 'PAY OUT SUB EXECUTIVE', user: req.body.masterid });
            const SubExecutiveExpenseAccount = await expenseSchema.findOne({ HeadName: 'PAY OUT SUB EXECUTIVE', masterid: req.body.masterid });

            const findSubExecutiveCredit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.subSubExecutive),
                type: 'PAY OUT SUB EXECUTIVE',
                // type: 'Receipt',
                d_c: 'Credit'
            });

            if (!findSubExecutiveCredit && SubExecutiveAccount?.garry && Number(req.body.subExecutiveComRupees)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = SubExecutiveAccount?.garry;
                state_mast.cashoppac_name = BankLinkAccount?.limitAccount;
                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "PAY OUT SUB EXECUTIVE";
                state_mast.expense = SubExecutiveExpenseAccount?._id;
                state_mast.srno = 9;
                state_mast.d_c = "Credit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.subExecutiveComRupees);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findSubExecutiveCredit) {
                const updateTrans = {
                    cashac_name: SubExecutiveAccount?.garry,
                    cashoppac_name: BankLinkAccount?.limitAccount,
                    srno: 9,
                    expense: SubExecutiveExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.subExecutiveComRupees),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Credit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'PAY OUT SUB EXECUTIVE', }, updateTrans);
            }

            // SubExecutive Debit ----------------------------

            const findSubExecutiveDebit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                // cashac_name: new mongoose.Types.ObjectId(req.body.ApplicantID),
                type: 'PAY OUT SUB EXECUTIVE',
                // type: 'Receipt',
                d_c: 'Debit',
            });

            if (!findSubExecutiveDebit && SubExecutiveAccount?.garry && Number(req.body.subExecutiveComRupees)) {
                let state_mast = new transSchema();
                state_mast.application_id = req.body._id;
                state_mast.cashac_name = BankLinkAccount?.limitAccount;
                state_mast.cashoppac_name = SubExecutiveAccount?.garry;

                state_mast.main_bk = 'JR';
                state_mast.c_j_s_p = 'JR';
                state_mast.type = "PAY OUT SUB EXECUTIVE";
                state_mast.expense = SubExecutiveExpenseAccount?._id;
                state_mast.srno = 9;
                state_mast.d_c = "Debit";
                // state_mast.type = "Receipt";
                state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
                state_mast.cash_amount = Number(req.body.subExecutiveComRupees);
                state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
                state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
                state_mast.masterid = req.body.masterid;
                state_mast.co_code = req.body.compid;
                state_mast.div_code = req.body.divid;
                await state_mast.save();
            }

            if (findSubExecutiveDebit) {
                const updateTrans = {
                    cashac_name: BankLinkAccount?.limitAccount,
                    cashoppac_name: SubExecutiveAccount?.garry,
                    srno: 9,
                    expense: SubExecutiveExpenseAccount?._id,
                    narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
                    cash_amount: Number(req.body.subExecutiveComRupees),
                    cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
                    cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
                }
                await transSchema.updateOne({ d_c: 'Debit', application_id: new mongoose.Types.ObjectId(req.body._id), type: 'PAY OUT SUB EXECUTIVE', }, updateTrans);
            }
            // Sub Executive  ----------------------------
            // const findSubExecutive = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive),
            //     type: 'XSE',
            //     // type: 'Receipt',
            // });

            // if (!findSubExecutive && req.body.executive && Number(req.body.subExecutiveComRupees)) {
            //     let state_mast = new transSchema();
            //     state_mast.application_id = req.body._id;
            //     state_mast.cashac_name = req.body.subExecutive;
            //     state_mast.main_bk = 'JR';
            //     state_mast.c_j_s_p = 'JR';
            //     state_mast.type = "XSE";
            //     state_mast.srno = 7;
            //     state_mast.d_c = "Credit";
            //     // state_mast.type = "Receipt";
            //     state_mast.narration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
            //     state_mast.cash_amount = Number(req.body.subExecutiveComRupees);
            //     state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            //     state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            //     state_mast.masterid = req.body.masterid;
            //     state_mast.co_code = req.body.compid;
            //     state_mast.div_code = req.body.divid;
            //     await state_mast.save();
            // }

            // if (findSubExecutive) {
            //     const updateTrans = {
            //         cashac_name: req.body.subExecutive,
            //         srno: 7,
            //         narration: `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`,
            //         cash_amount: Number(req.body.subExecutiveComRupees),
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), cashac_name: new mongoose.Types.ObjectId(req.body.subExecutive), type: 'XSE', }, updateTrans);
            // }

        }
        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'CustomerApplicationSchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.StagesGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N", _id: new mongoose.Types.ObjectId(req.query._id) };

        if (req.query.stage === "Login") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $project: { Login_remark: 1 } }
            ]);
            return res.json({ lastEntryNo: lastEntryNo[0] });
        }

        if (req.query.stage === "SoftApproval") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $project: { SoftApproval_bank: 1, SoftApproval_firm: 1, SoftApproval_crcc: 1, SoftApproval_date: 1, SoftApproval_Amount: 1, SoftApproval_Tenure: 1, SoftApproval_remark: 1 } }
            ]);

            const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
                { path: 'SoftApproval_firm', select: 'div_mast' },
                { path: 'SoftApproval_bank', select: 'bankName companyName' },
            ]);

            return res.json({ lastEntryNo: populatedEntries[0] });
        }

        if (req.query.stage === "Approved") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $project: { Approved_bank: 1, Approved_firm: 1, Approved_crcc: 1, Approved_date: 1, Approved_Amount: 1, Approved_Tenure: 1, Approved_remark: 1 } }
            ]);

            const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
                { path: 'Approved_firm', select: 'div_mast' },
                { path: 'Approved_bank', select: 'bankName companyName' },
            ]);

            return res.json({ lastEntryNo: populatedEntries[0] });
        }

        if (req.query.stage === "Reject") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $project: { Reject_query: 1, Reject_date: 1 } }
            ]);
            return res.json({ lastEntryNo: lastEntryNo[0] });
        }

        if (req.query.stage === "Cancelled") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $project: { Cancelled_query: 1, Cancelled_date: 1 } }
            ]);

            return res.json({ lastEntryNo: lastEntryNo[0] });
        }

        if (req.query.stage === "UnderDisbursement") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $project: { UnderDisbursement_date: 1, UnderDisbursement_bank: 1, UnderDisbursement_Interest: 1, UnderDisbursement_Query: 1, UnderDisbursement_EMI: 1, UnderDisbursement_Amount: 1, UnderDisbursement_Tenure: 1 } }
            ]);

            const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
                { path: 'UnderDisbursement_firm', select: 'div_mast' },
                { path: 'UnderDisbursement_bank', select: 'bankName' },
            ]);

            return res.json({ lastEntryNo: populatedEntries[0] });
        }

        if (req.query.stage === "Disbursement") {
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
            ]);

            const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
                { path: 'Disbursement_firm', select: 'div_mast' },
                { path: 'Disbursement_bank' },
                { path: 'Disbursement_loanType', select: 'CustomerCategory' },
                { path: 'Disbursement_dealer', select: 'ACName' },
                { path: 'Disbursement_executive', select: 'ACName' },
                { path: 'Disbursement_subExecutive', select: 'ACName' },
                { path: 'Disbursement_loanCreditAC', select: 'ACName' },

                { path: 'bank', select: 'bankName companyName' },
                { path: 'firm', select: 'div_mast' },
                { path: 'bank2', select: 'bankName' },
                { path: 'firm2', select: 'div_mast' },
                { path: 'Applicant', select: 'ACName MobileNo PanNumber', populate: { path: 'CityName', select: 'CityName' } }, // Populate CityName reference
                { path: 'CoApplicant', select: 'ACName' },
                { path: 'Guranter', select: 'cutomer_name' },
                { path: 'Make', select: 'Description' },
                { path: 'Model', select: 'Description' },
                { path: 'Variant', select: 'Description' },
                { path: 'Executive', select: 'ACName' },
                { path: 'SubExecutive', select: 'ACName' },
                { path: 'Dealer', select: 'ACName PanNumber' },
                { path: 'SubDealer', select: 'ACName' },
            ]);

            return res.json({ lastEntryNo: populatedEntries[0] });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CancelLoginApplications = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const qry = { stage: 'Login', masterid: req.body.masterid, del: "N", date: { $gte: startDate, $lt: endDate } };
        const lastEntryNo = await CustomerApplicationSchema.aggregate([
            { $match: qry },
            { $project: { _id: 1 } }
        ]);

        for (const item of lastEntryNo) {
            await CustomerApplicationSchema.updateOne(
                { _id: new mongoose.Types.ObjectId(item._id) },
                {
                    $set: {
                        stage: 'Cancelled',
                        Cancelled_date: userDateObject,
                        Cancelled_date_datemilisecond: entrydatemilisecond,
                        update: userDateObject,
                        update_datemilisecond: entrydatemilisecond,
                    }
                }
            );
        }

        res.json({ status: true, message: 'Applications Cancelled Successfully' });
    } catch (error) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
exports.PaymentUpdate = async (req, res) => {
    try {
        const ApplicationNo = await transSchema.aggregate([
            { $match: { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, main_bk: 'CB' } }, // Filter for c_j_s_p being 'CB'
            { $group: { _id: null, vouc_code: { $max: "$vouc_code" } } }
        ]);


        if (req.body.ACtype === 'Dealer') {
            // const findDealer = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     main_bk: 'CB',
            //     type: 'Payment'
            // });

            // if (!findDealer) {
            let state_mast = new transSchema();
            state_mast.application_id = req.body._id;
            state_mast.cashac_name = req.body.ApplicantID;
            state_mast.cashoppac_name = req.body.cashoppac_name;
            state_mast.main_bk = "CB";
            state_mast.c_j_s_p = "DL";
            state_mast.Dealer_name = req.body.ModelACName,
                state_mast.d_c = "Debit";
            state_mast.type = "Payment";
            state_mast.cash_chequeno = req.body.Cheque
            state_mast.srno = 10;
            state_mast.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast.narration = req.body.naration;
            state_mast.narration2 = req.body.naration2;
            state_mast.cash_amount = Number(req.body.amount);
            state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast.masterid = req.body.masterid;
            state_mast.co_code = req.body.compid;
            state_mast.div_code = req.body.divid;

            let state_mast2 = new transSchema();

            state_mast2.application_id = req.body._id;
            state_mast2.cashoppac_name = req.body.ApplicantID;
            state_mast2.cashac_name = req.body.cashoppac_name;
            state_mast2.main_bk = "CB";
            state_mast2.c_j_s_p = "DL";
            state_mast2.d_c = "Credit";
            state_mast2.type = "Payment";
            state_mast2.cash_chequeno = req.body.Cheque
            state_mast2.srno = 10;
            state_mast2.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast2.narration = req.body.naration;
            state_mast2.narration2 = req.body.naration2;
            state_mast2.cash_amount = Number(req.body.amount);
            state_mast2.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;


            await state_mast.save();
            await state_mast2.save();

            return res.json({ status: true, message: "Updated successfully" });
            // }

            // if (findDealer) {
            //     const updateTrans = {
            //         cashac_name: req.body.ModelACName,
            //         narration: req.body.naration,
            //         narration2: req.body.naration2,
            //         cash_amount: Number(req.body.amount),
            //         cashoppac_name: req.body.cashoppac_name,
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), main_bk: 'CB', type: 'Payment' }, updateTrans);
            //     return res.json({ status: true, message: "Updated successfully" });
            // }
        }

        if (req.body.ACtype === 'LoanCredit') {
            // const findLoanCredit = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     main_bk: 'CB',
            //     type: 'Payment'
            // });

            // if (!findLoanCredit) {
            let state_mast = new transSchema();
            state_mast.application_id = req.body._id;
            state_mast.cashac_name = req.body.ModelACName;
            state_mast.main_bk = "CB";
            state_mast.c_j_s_p = "LC";
            state_mast.d_c = "Debit";
            state_mast.srno = 11;
            state_mast.type = "Payment";
            state_mast.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast.narration = req.body.naration;
            state_mast.narration2 = req.body.naration2;
            state_mast.cashoppac_name = req.body.cashoppac_name;
            state_mast.cash_amount = Number(req.body.amount);
            state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast.masterid = req.body.masterid;
            state_mast.co_code = req.body.compid;
            state_mast.div_code = req.body.divid;


            let state_mast2 = new transSchema();

            state_mast2.application_id = req.body._id;
            state_mast2.cashoppac_name = req.body.ModelACName;
            state_mast2.cashac_name = req.body.cashoppac_name;
            state_mast2.main_bk = "CB";
            state_mast.c_j_s_p = "LC";
            state_mast2.d_c = "Credit";
            state_mast2.type = "Payment";
            state_mast2.cash_chequeno = req.body.Cheque
            state_mast.srno = 11;
            state_mast2.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast2.narration = req.body.naration;
            state_mast2.narration2 = req.body.naration2;
            state_mast2.cash_amount = Number(req.body.amount);
            state_mast2.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;


            await state_mast.save();
            await state_mast2.save();

            return res.json({ status: true, message: "Updated successfully" });
            // }

            // if (findLoanCredit) {
            //     const updateTrans = {
            //         cashac_name: req.body.ModelACName,
            //         narration: req.body.naration,
            //         narration2: req.body.naration2,
            //         cash_amount: Number(req.body.amount),
            //         cashoppac_name: req.body.cashoppac_name,
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     console.log(updateTrans)
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), main_bk: 'CB', type: 'Payment' }, updateTrans);
            //     return res.json({ status: true, message: "Updated successfully" });
            // }
        }

        if (req.body.ACtype === 'SubExecutive') {
            // const findSubExecutive = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     main_bk: 'CB',
            //     type: 'Payment'
            // });

            // if (!findSubExecutive) {
            let state_mast = new transSchema();
            state_mast.application_id = req.body._id;
            state_mast.cashac_name = req.body.ModelACName;
            state_mast.main_bk = "CB";
            state_mast.c_j_s_p = "SXE";
            state_mast.d_c = "Debit";
            state_mast.srno = 12;
            state_mast.type = "Payment";
            state_mast.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast.narration = req.body.naration;
            state_mast.narration2 = req.body.naration2;
            state_mast.cashoppac_name = req.body.cashoppac_name;
            state_mast.cash_amount = Number(req.body.amount);
            state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast.masterid = req.body.masterid;
            state_mast.co_code = req.body.compid;
            state_mast.div_code = req.body.divid;

            let state_mast2 = new transSchema();

            state_mast2.application_id = req.body._id;
            state_mast2.cashoppac_name = req.body.ModelACName;
            state_mast2.cashac_name = req.body.cashoppac_name;
            state_mast2.main_bk = "CB";
            state_mast.c_j_s_p = "SXE";
            state_mast2.d_c = "Credit";
            state_mast2.type = "Payment";
            state_mast2.cash_chequeno = req.body.Cheque
            state_mast.srno = 12;
            state_mast2.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast2.narration = req.body.naration;
            state_mast2.narration2 = req.body.naration2;
            state_mast2.cash_amount = Number(req.body.amount);
            state_mast2.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;


            await state_mast.save();
            await state_mast2.save();

            return res.json({ status: true, message: "Updated successfully" });
            // }

            // if (findSubExecutive) {
            //     const updateTrans = {
            //         cashac_name: req.body.ModelACName,
            //         narration: req.body.naration,
            //         narration2: req.body.naration2,
            //         cash_amount: Number(req.body.amount),
            //         cashoppac_name: req.body.cashoppac_name,
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), main_bk: 'CB', type: 'Payment' }, updateTrans);
            //     return res.json({ status: true, message: "Updated successfully" });
            // }
        }

        if (req.body.ACtype === 'Executive') {
            // const findExecutive = await transSchema.findOne({
            //     application_id: new mongoose.Types.ObjectId(req.body._id),
            //     main_bk: 'CB',
            //     type: 'Payment'
            // });

            // if (!findExecutive) {
            let state_mast = new transSchema();
            state_mast.application_id = req.body._id;
            state_mast.cashac_name = req.body.ModelACName;
            state_mast.main_bk = "CB";
            state_mast.c_j_s_p = "EXE";
            state_mast.d_c = "Debit";
            state_mast.srno = 13;
            state_mast.type = "Payment";
            state_mast.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;

            state_mast.narration = req.body.naration;
            state_mast.narration2 = req.body.naration2;
            state_mast.cashoppac_name = req.body.cashoppac_name;
            state_mast.cash_amount = Number(req.body.amount);
            state_mast.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast.masterid = req.body.masterid;
            state_mast.co_code = req.body.compid;
            state_mast.div_code = req.body.divid;

            let state_mast2 = new transSchema();

            state_mast2.application_id = req.body._id;
            state_mast2.cashoppac_name = req.body.ModelACName;
            state_mast2.cashac_name = req.body.cashoppac_name;
            state_mast2.main_bk = "CB";
            state_mast.c_j_s_p = "EXE";
            state_mast2.d_c = "Credit";
            state_mast2.type = "Payment";
            state_mast2.cash_chequeno = req.body.Cheque
            state_mast.srno = 13;
            state_mast2.vouc_code = ApplicationNo[0]?.vouc_code + 1 || 1;
            state_mast2.narration = req.body.naration;
            state_mast2.narration2 = req.body.naration2;
            state_mast2.cash_amount = Number(req.body.amount);
            state_mast2.cash_date = moment(req.body.date).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;


            await state_mast.save();
            await state_mast2.save();

            return res.json({ status: true, message: "Updated successfully" });
            // }

            // if (findExecutive) {
            //     const updateTrans = {
            //         cashac_name: req.body.ModelACName,
            //         narration: req.body.naration,
            //         narration2: req.body.naration2,
            //         cash_amount: Number(req.body.amount),
            //         cashoppac_name: req.body.cashoppac_name,
            //         cash_date: moment(req.body.date).tz("Asia/Kolkata").toDate(),
            //         cash_edatemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            //     }
            //     await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), main_bk: 'CB', type: 'Payment' }, updateTrans);
            //     return res.json({ status: true, message: "Updated successfully" });
            // }
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
}

exports.PostAgent = async (req, res) => {
    try {

        let state_mast = new transSchema();
        state_mast.c_j_s_p = 'JR';
        state_mast.cashac_name = req.body.PostAgent;
        state_mast.d_c = "Credit";
        state_mast.type = `${req.body.PostType}A`;
        state_mast.main_bk = 'JR';
        state_mast.paid = "No",
            state_mast.cashac_name = req.body.PostAgent;
        state_mast.cashoppac_name = req.body.DebitID;
        state_mast.narration = req.body.narration;
        state_mast.expense = req.body.Postexpense;
        state_mast.cash_amount = Number(req.body.PostAmount);
        state_mast.application_id = req.body._id;
        if (req.body.PostType === 'RTO') {
            state_mast.srno = 2;
        }
        if (req.body.PostType === 'OTHER') {
            state_mast.srno = 3;
        }
        if (req.body.PostType === 'PAY OUT DEALER') {
            state_mast.srno = 7;
        }
        if (req.body.PostType === 'PAY OUT EXECUTIVE') {
            state_mast.srno = 8;
        }
        if (req.body.PostType === 'PAY OUT SUB EXECUTIVE') {
            state_mast.srno = 9;
        }
        if (req.body.PostDate) {
            state_mast.renewal_date = moment(req.body.PostDate).tz("Asia/Kolkata").toDate();
            state_mast.renewal_edatemilisecond = moment(req.body.PostDate).tz("Asia/Kolkata").format('x');
        }
        const cDate = req.body.PostCashDate || new Date();
        state_mast.cash_date = moment(cDate).tz("Asia/Kolkata").toDate();
        state_mast.cash_edatemilisecond = moment(cDate).tz("Asia/Kolkata").format('x');
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();

        let state_mast2 = new transSchema();
        state_mast2.type = `${req.body.PostType}A`;
        state_mast2.cashac_name = req.body.DebitID;
        state_mast2.d_c = "Debit";
        // state_mast2.type = "Receipt";
        state_mast2.main_bk = 'JR';
        state_mast2.c_j_s_p = 'JR';
        state_mast2.cash_amount = Number(req.body.PostAmount);
        state_mast2.cashoppac_name = req.body.PostAgent;
        state_mast2.narration = req.body.narration;
        state_mast2.expense = req.body.Postexpense;
        state_mast2.application_id = req.body._id;
        if (req.body.PostType === 'RTO') {
            state_mast2.srno = 2;
        }
        if (req.body.PostType === 'OTHER') {
            state_mast2.srno = 3;
        }
        if (req.body.PostType === 'PAY OUT DEALER') {
            state_mast2.srno = 7;
        }
        if (req.body.PostType === 'PAY OUT EXECUTIVE') {
            state_mast.srno = 8;
        }
        if (req.body.PostType === 'PAY OUT SUB EXECUTIVE') {
            state_mast.srno = 9;
        }
        state_mast2.cash_date = moment(new Date()).tz("Asia/Kolkata").toDate();
        state_mast2.cash_edatemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast2.user = req.body.user;
        state_mast2.masterid = req.body.masterid;
        state_mast2.co_code = req.body.compid;
        state_mast2.div_code = req.body.divid;
        state_mast2.entry = userDateObject;
        state_mast2.entry_datemilisecond = entrydatemilisecond;
        state_mast2.del = 'N';

        await state_mast2.save();

        const newState = {
            post: 'Yes',
            update: userDateObject,
            update_datemilisecond: entrydatemilisecond,
        };
        await transSchema.updateOne({ application_id: new mongoose.Types.ObjectId(req.body._id), cashac_name: new mongoose.Types.ObjectId(req.body.DebitID), d_c: 'Credit', type: req.body.PostType }, newState);

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'transSchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });


    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.narationGet = async (req, res) => {
    try {
        const findData = await CustomerApplicationSchema.findOne({
            _id: new mongoose.Types.ObjectId(req.body._id)
        })
            .select('VehicleNo Applicant Disbursement_bank')
            .populate({
                path: 'Applicant',
                select: 'ACName'
            });
        const naration = `${findData?.VehicleNo} / ${findData?.Applicant?.ACName} /  ${req.body.bankstring} / ${req.body.loanAmount}`;
        return res.json({ naration });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
}

exports.PaymentGet = async (req, res) => {
    try {
        if (req.body.ACtype === 'Dealer') {
            const findDealer = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                main_bk: 'XDL',
                type: 'Payment'
            }).populate('cashac_name').populate('cashoppac_name');

            return res.json({ status: true, data: findDealer });
        }

        if (req.body.ACtype === 'LoanCredit') {
            const findLoanCredit = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                main_bk: 'XLC',
                type: 'Payment'
            }).populate('cashac_name').populate('cashoppac_name');

            return res.json({ status: true, data: findLoanCredit });
        }

        if (req.body.ACtype === 'SubExecutive') {
            const findSubExecutive = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                main_bk: 'XSE',
                type: 'Payment'
            }).populate('cashac_name').populate('cashoppac_name');

            return res.json({ status: true, data: findSubExecutive });
        }

        if (req.body.ACtype === 'Executive') {
            const findExecutive = await transSchema.findOne({
                application_id: new mongoose.Types.ObjectId(req.body._id),
                main_bk: 'XEX',
                type: 'Payment'
            }).populate('cashac_name').populate('cashoppac_name');

            return res.json({ status: true, data: findExecutive });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
}

exports.DisbursedTransGET = async (req, res) => {
    try {
        qry = {
            masterid: req.query.masterid,
            application_id: new mongoose.Types.ObjectId(req.query.application_id)
        };

        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
            { path: 'expense' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Account Setup

exports.AccountSetupNames_Add = async (req, res) => {
    try {
        // Extract the data to be inserted
        const data =
            [{ "group": "RTO", },
            { "group": "OTHER", },
            { "group": "GST", },
            { "group": "TDS", },
            { "group": "COMMISSION", },
            { "group": "PAY OUT DEALER", },
            { "group": "PAY OUT EXECUTIVE", },
            { "group": "PAY OUT SUB EXECUTIVE", }];

        // Iterate over the data array and insert each entry into the database if it doesn't already exist
        for (const item of data) {
            const newState = {
                group: item.group,
                user: req.body.masterid,
            };

            // Check if an entry with the same group and user already exists
            const existingGroup = await accountSetupSchema.findOne({
                group: newState.group,
                user: req.body.masterid
            });

            if (!existingGroup) {
                // If it doesn't exist, insert the new entry into the database
                const createdEntry = await accountSetupSchema.create(newState);
            }
        }

        // Create a new user log entry
        const userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'accountSetupSchema';
        userLog.user_op = 'A';
        userLog.entry_id = req.body.user;
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.AccountSetupTypesWithIDGET = async (req, res) => {
    try {
        const qry = { user: req.query.masterid };
        const result = await accountSetupSchema.aggregate([
            { $match: qry },
            { $sort: { group: -1 } },
            { $project: { group: 1, _id: 1 } }
        ]);

        // Extract GroupName into an array
        const totalCount = result.length;

        res.json({ totalCount, groupNames: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AccountSetup_Add = async (req, res) => {
    try {
        if (req.body._id) {

            const newState = {
                garry: req.body.garry,
                user: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            // Update existing salary head
            await accountSetupSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'accountSetupSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

// exports.AccountSetupGET = async (req, res) => {
//     try {
//         const qry = { group: req.query.ID, user: req.query.masterid };
//         const lastEntryNo = await accountSetupSchema.aggregate([
//             { $match: qry },
//             { $sort: { _id: -1 } },
//             {
//                 $project: {
//                     garry: 1,
//                     _id: 1
//                 }
//             }
//         ]);

//         // Populating the entries with the related GroupName from groupSchema
//         const populatedEntries = await accountSetupSchema.populate(lastEntryNo, {
//             path: 'garry',
//             select: 'ACName',
//         });

//         const totalCount = populatedEntries.length;

//         res.json({ totalCount, lastEntryNo: populatedEntries });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.AccountSetupGET = async (req, res) => {
    try {
        const qry = { group: req.query.ID, user: req.query.masterid };
        const lastEntryNo = await accountSetupSchema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $lookup: {
                    from: 'accountSchema', // The name of the collection for the groupSchema
                    localField: 'garry',
                    foreignField: '_id',
                    as: 'garryDetails'
                }
            },
            {
                $unwind: { path: '$garryDetails', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    'garryDetails.ACName': 1
                }
            }
        ]);

        const totalCount = lastEntryNo.length;
        const transformed = lastEntryNo.map(item => ({
            "_id": item._id,
            "garry": {
                "_id": item?._id,
                "ACName": item?.garryDetails?.ACName
            }
        }));

        res.json({ totalCount, lastEntryNo: transformed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Accounting Reports

exports.ledgerReportGroupsGET = async (req, res) => {
    try {
        // Step 1: Find all entries for groups excluding "Bank" and "Cash"
        const allEntries = await group_setup_schema.aggregate([
            { $match: { group: { $nin: ["Bank", "Cash"] }, user: req.body.masterid } },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Combine the garry arrays from all results
        const combinedGarry = allEntries.reduce((acc, entry) => {
            return acc.concat(entry.garry);
        }, []);

        if (!combinedGarry.length) {
            return res.status(404).json({ error: 'No entries found for the specified criteria' });
        }

        // Step 3: Fetch groups based on the combined garry array
        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: combinedGarry }
        };

        const groups = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1 } }
        ]);

        res.json({ lastEntryNo: groups });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.LedgerreportGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

        // Set time to start and end of day in IST
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        // Adjust to IST time zone (UTC+5:30)
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30);

        const adjustedStartDate = new Date(startDate);
        const adjustedEndDate = new Date(endDate);

        // Adjust for the query to include all of the selected day in IST
        startDate.setUTCHours(18, 30, 0, 0);
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let combinedResults = [];
        for (let dealerId of req.body.dealer) {
            // Query for the main period
            const qryMainPeriod = {
                cashac_name: new mongoose.Types.ObjectId(dealerId),
                masterid: req.query.masterid,
                div_code: req.query.divid,
                co_code: req.query.compid,
                cash_date: { $gte: startDate, $lt: endDate },
            };

            const lastEntryNoMain = await transSchema.aggregate([
                { $match: qryMainPeriod },
                { $sort: { cash_date: 1 } },
            ]);

            const populatedEntriesMain = await transSchema.populate(lastEntryNoMain, [
                { path: 'cashac_name', select: 'ACName' },
                { path: 'cashoppac_name', select: 'ACName' },
            ]);

            // Adjust start date for the previous period query
            const previousPeriodEndDate = new Date(adjustedStartDate);
            previousPeriodEndDate.setUTCHours(18, 29, 59, 999);


            // Query for the previous period (all data before the start date)
            const qryPreviousPeriod = {
                cashac_name: new mongoose.Types.ObjectId(dealerId),
                masterid: req.query.masterid,
                div_code: req.query.divid,
                co_code: req.query.compid,
                cash_date: { $lt: previousPeriodEndDate },
                // cashac_name: { $exists: true, $ne: null } // Ensure cashac_name exists and is not null
            };

            const lastEntryNoPrevious = await transSchema.aggregate([
                { $match: qryPreviousPeriod },
                { $sort: { cash_date: 1 } },
            ]);

            const populatedEntriesPrevious = await transSchema.populate(lastEntryNoPrevious, [
                { path: 'cashac_name', select: 'ACName' },
                { path: 'cashoppac_name', select: 'ACName' },
            ]);

            let balance = 0;

            const dataWithSerialNumbers = populatedEntriesPrevious.map((item, index) => {
                let newItem = { ...item };

                if (item?.d_c === "Debit") {
                    balance += item.cash_amount;
                }

                if (item?.d_c === "Credit") {
                    balance -= item.cash_amount;
                }

                return newItem;
            });

            const opening = dataWithSerialNumbers[dataWithSerialNumbers.length - 1] || {};

            opening.cash_date = startDate;
            opening.narration = "Opening";
            opening.main_bk = "";
            opening.cashoppac_name = "";
            // opening.cashac_name = populatedEntriesPrevious[0]?.cashac_name || "N/A";
            opening.d_c = balance >= 0 ? "Debit" : "Credit";
            opening.cash_amount = Math.abs(balance); // Use absolute value for cash_amount
            if (populatedEntriesPrevious.length === 0) {
                // Fetch cashac_name from the database using dealerId
                const dealer = await accountSchema.findById(dealerId).select('_id ACName');
                opening.cashac_name = dealer ? dealer : "N/A";
            } else {
                // Use cashac_name from populatedEntriesPrevious
                opening.cashac_name = populatedEntriesPrevious[0].cashac_name;
                opening.cashoppac_name = populatedEntriesPrevious[0].cashoppac_name;
            }
            let dfg = [populatedEntriesMain];
            dfg = [opening, ...populatedEntriesMain];
            combinedResults.push(dfg);
        }

        res.json({
            lastEntryNo: combinedResults,
            // lastEntryNoPrevious: populatedEntriesPrevious
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Bank_CashReportGroupsGET = async (req, res) => {
    try {
        // Step 1: Find the latest entry for "Bank" group
        const bankLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Bank", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Step 2: Find the latest entry for "Cash" group
        const cashLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Cash", user: req.body.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Combine the garry arrays from both results
        const combinedGarry = [
            ...(bankLastEntry[0]?.garry || []),
            ...(cashLastEntry[0]?.garry || [])
        ];

        if (!combinedGarry.length) {
            return res.status(404).json({ error: 'No entries found for the specified criteria' });
        }

        // Step 3: Fetch groups based on the combined garry array
        const qry = {
            masterid: req.body.masterid,
            del: "N",
            _id: { $in: combinedGarry }
        };

        const groups = await groupSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            { $project: { GroupName: 1, _id: 1, Address: 1 } }
        ]);

        res.json({ lastEntryNo: groups });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CashBankreportGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

        // Set time to start and end of day in IST
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        // Adjust to IST time zone (UTC+5:30)
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30);

        const adjustedStartDate = new Date(startDate);
        const adjustedEndDate = new Date(endDate);

        // Adjust for the query to include all of the selected day in IST
        startDate.setUTCHours(18, 30, 0, 0);
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let combinedResults = [];
        for (let dealerId of req.body.dealer) {
            // Query for the main period
            const qryMainPeriod = {
                cashoppac_name: new mongoose.Types.ObjectId(dealerId),
                masterid: req.query.masterid,
                div_code: req.query.divid,
                co_code: req.query.compid,
                cash_date: { $gte: startDate, $lt: endDate },
            };

            const lastEntryNoMain = await transSchema.aggregate([
                { $match: qryMainPeriod },
                { $sort: { cash_date: 1 } },
            ]);

            const populatedEntriesMain = await transSchema.populate(lastEntryNoMain, [
                { path: 'cashac_name', select: 'ACName' },
                { path: 'cashoppac_name', select: 'ACName' },
            ]);

            // Adjust start date for the previous period query
            const previousPeriodEndDate = new Date(adjustedStartDate);
            previousPeriodEndDate.setUTCHours(18, 29, 59, 999);


            // Query for the previous period (all data before the start date)
            const qryPreviousPeriod = {
                cashoppac_name: new mongoose.Types.ObjectId(dealerId),
                masterid: req.query.masterid,
                div_code: req.query.divid,
                co_code: req.query.compid,
                cash_date: { $lt: previousPeriodEndDate },
            };

            const lastEntryNoPrevious = await transSchema.aggregate([
                { $match: qryPreviousPeriod },
                { $sort: { cash_date: 1 } },
            ]);

            const populatedEntriesPrevious = await transSchema.populate(lastEntryNoPrevious, [
                { path: 'cashac_name', select: 'ACName' },
                { path: 'cashoppac_name', select: 'ACName' },
            ]);

            let balance = 0;

            const dataWithSerialNumbers = populatedEntriesPrevious.map((item, index) => {
                let newItem = { ...item };

                if (item?.d_c === "Debit") {
                    balance += item.cash_amount;
                }

                if (item?.d_c === "Credit") {
                    balance -= item.cash_amount;
                }

                return newItem;
            });

            const opening = dataWithSerialNumbers[dataWithSerialNumbers.length - 1] || {};

            opening.cash_date = startDate;
            opening.narration = "Opening";
            opening.main_bk = "";
            opening.cashoppac_name = populatedEntriesPrevious[0]?.cashoppac_name || '';
            opening.d_c = balance >= 0 ? "Debit" : "Credit";
            opening.cash_amount = Math.abs(balance); // Use absolute value for cash_amount
            if (populatedEntriesPrevious.length === 0) {
                const dealer = await accountSchema.findById(dealerId).select('_id ACName');
                opening.cashac_name = dealer ? dealer : "N/A";
            } else {
                opening.cashac_name = populatedEntriesPrevious[0].cashac_name;
            }
            let dfg = [populatedEntriesMain];
            dfg = [opening, ...populatedEntriesMain];
            combinedResults.push(dfg);
        }

        res.json({
            lastEntryNo: combinedResults,
            // lastEntryNoPrevious: populatedEntriesPrevious
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ReportAccountsGET = async (req, res) => {
    try {
        const searchQuery = req.query.query || ''; // Capture the search query
        const regex = new RegExp(searchQuery, 'i'); // Create a case-insensitive regex

        const qry = {
            masterid: req.query.masterid, del: "N", $or: [
                { 'ACName': regex },
                { 'cutomer_name': regex },
            ]
        };
        const groupIds = req.query?.group?.map(groupId => new mongoose.Types.ObjectId(groupId));
        qry.GroupName = { $in: groupIds || [] };

        const lastEntryNo = await accountSchema.aggregate([
            { $match: qry },
            // { $sort: { entry: -1 } },
            {
                $project: {
                    ACName: 1,
                    GroupName: 1,
                    // Alias: 1,
                    // PanNumber: 1,
                    // CityName: 1,
                    // StateName: 1,
                    // MobileNo: 1,
                    // Address1: 1,
                    // GSTIN: 1,
                    // AadharNumber: 1,
                    // ac_bank: 1,
                    _id: 1 // Include _id to match with transSchema
                }
            },
            { $limit: 500 }
        ]);

        const populatedEntries = await accountSchema.populate(lastEntryNo, [
            // { path: 'StateName', select: 'StateName' },
            // { path: 'CityName', select: 'CityName' },
            { path: 'GroupName', select: 'GroupName Address' } // Include Address field from GroupName
        ]);

        // Fetch d_c and cash_amount from transSchema for each populated entry
        const entriesWithTransData = await Promise.all(populatedEntries.map(async (entry) => {
            const transData = await transSchema.findOne({ cashac_name: entry._id }, { d_c: 1, cash_amount: 1 });
            return {
                ...entry,
                transData: transData ? transData.toObject() : {}
            };
        }));

        const totalCount = populatedEntries.length;

        res.json({ totalCount, lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// TraileportGET
exports.TraileportGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

        // Set time to start and end of day in IST
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);

        // Adjust to IST time zone (UTC+5:30)
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30);

        const adjustedStartDate = new Date(startDate);
        const adjustedEndDate = new Date(endDate);

        // Adjust for the query to include all of the selected day in IST
        startDate.setUTCHours(18, 30, 0, 0);
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let combinedResults = [];

        for (let dealerId of req.body.dealer) {
            // Query for the previous period (all data before the start date)

            // Adjust start date for the previous period query
            const previousPeriodEndDate = new Date(adjustedStartDate);
            previousPeriodEndDate.setUTCHours(18, 29, 59, 999);


            // Query for the previous period (all data before the start date)
            const qryPreviousPeriod = {
                cashac_name: new mongoose.Types.ObjectId(dealerId),
                masterid: req.query.masterid,
                div_code: req.query.divid,
                co_code: req.query.compid,
                cash_date: { $lt: previousPeriodEndDate },
                // cashac_name: { $exists: true, $ne: null } // Ensure cashac_name exists and is not null
            };

            // Fetch transactions for the previous period
            const populatedEntriesPrevious = await transSchema.aggregate([
                { $match: qryPreviousPeriod },
                { $sort: { cash_date: 1 } },
                { $lookup: { from: 'accountSchema', localField: 'cashac_name', foreignField: '_id', as: 'cashAccount' } },
                { $unwind: '$cashAccount' },
            ]);
            let openingBalance = 0;

            // Calculate opening balance from previous period
            populatedEntriesPrevious.forEach(item => {
                if (item.d_c === "Debit") {
                    openingBalance += item.cash_amount;
                } else if (item.d_c === "Credit") {
                    openingBalance -= item.cash_amount;
                }
            });

            // Query for the main period
            const qryMainPeriod = {
                cashac_name: new mongoose.Types.ObjectId(dealerId),
                masterid: req.query.masterid,
                div_code: req.query.divid,
                co_code: req.query.compid,
                cash_date: { $gte: startDate, $lt: endDate },
            };

            // Fetch transactions for the main period
            const populatedEntriesMain = await transSchema.aggregate([
                { $match: qryMainPeriod },
                { $sort: { cash_date: 1 } },
                { $lookup: { from: 'accountSchema', localField: 'cashac_name', foreignField: '_id', as: 'cashAccount' } },
                { $unwind: '$cashAccount' },
            ]);

            // Calculate debit and credit totals for the main period
            let totalDebit = 0;
            let totalCredit = 0;

            populatedEntriesMain.forEach(item => {
                if (item.d_c === "Debit") {
                    totalDebit += item.cash_amount;
                } else if (item.d_c === "Credit") {
                    totalCredit += item.cash_amount;
                }
            });

            // Calculate closing balance
            let closingBalance = openingBalance + totalDebit - totalCredit;

            // Determine opening balance direction
            const openingDC = openingBalance >= 0 ? "Debit" : "Credit";

            // Prepare single row for the dealer
            const dealer = await accountSchema.findById(dealerId)
                .select('_id ACName GroupName') // Include GroupName in the select query
                .populate('GroupName', 'GroupName'); // Populate GroupName with specific fields if needed
            const dealerRow = {
                dealerId: dealerId, // Include dealer ID or any identifier
                openingBalance: openingBalance,
                openingBalanceDC: openingDC,
                totalDebit: totalDebit,
                totalCredit: totalCredit,
                closingBalance: closingBalance,
                closingBalanceDC: closingBalance >= 0 ? "Debit" : "Credit",
                cashac_name: dealer,
            };

            combinedResults.push(dealerRow);
        }

        res.json({
            ledgerReport: combinedResults,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// BankLimitGET
exports.BankLimitGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const qry = { Disbursement_BankLimit: true, masterid: req.query.masterid, del: "N", Disbursement_date: { $gte: startDate, $lt: endDate }, Disbursement_bank: new mongoose.Types.ObjectId(req.query.bank) };

        if (req.query.empSubEx) {
            qry.$or = [
                { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
            ];
        }

        if (req.query.type === 'Yes') {
            // qry.Disbursement_limitAmount = null;
            qry.Disbursement_limitAmount = { $gt: 0 };
        } else if (req.query.type === 'No') {
            // qry.Disbursement_limitAmount = { $gt: 0 };
            qry.Disbursement_limitAmount = null;
        }
        const lastEntryNo = await CustomerApplicationSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
        ]);

        const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
            { path: 'bank', select: 'bankName' },
            { path: 'firm', select: 'div_mast' },
            { path: 'bank2', select: 'bankName' },
            { path: 'firm2', select: 'div_mast' },
            { path: 'Applicant', select: 'ACName engineNo chasisNo MobileNo PanNumber', populate: { path: 'CityName', select: 'CityName' } }, // Populate CityName reference
            { path: 'CoApplicant', select: 'ACName' },
            { path: 'Guranter', select: 'cutomer_name' },
            { path: 'Make', select: 'Description' },
            { path: 'Model', select: 'Description' },
            { path: 'Variant', select: 'Description' },
            { path: 'Executive', select: 'ACName' },
            { path: 'SubExecutive', select: 'ACName' },
            { path: 'Dealer', select: 'ACName PanNumber' },
            { path: 'SubDealer', select: 'ACName' },
            { path: 'Disbursement_loanType', select: 'CustomerCategory' }
        ]);

        const bankDetails = await bankSchema.findOne({ _id: new mongoose.Types.ObjectId(req.query.bank) });
        const AllbankDetails = await bankSchema.find({}).select('_id');

        res.json({ lastEntryNo: populatedEntries, bankDetails, AllbankDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const calculateTotals = (data) => {
    const totalLoanAmount = data.reduce((acc, item) => acc + (Number(item.Disbursement_loanAmount) || 0), 0);
    const totalLimitAmount = data.reduce((acc, item) => acc + (Number(item.Disbursement_limitAmount) || 0), 0);
    return { totalLoanAmount, totalLimitAmount };
};

exports.BankLimitDetailsGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const AllbankDetails = await bankSchema.find({ masterid: req.query.masterid, del: "N" });

        if (req.query.bank) {
            const qry = { Disbursement_BankLimit: true, masterid: req.query.masterid, del: "N", Disbursement_date: { $gte: startDate, $lt: endDate }, Disbursement_bank: new mongoose.Types.ObjectId(req.query.bank), Disbursement_limitAmount: { $eq: null } };
            const lastEntryNo = await CustomerApplicationSchema.aggregate([
                { $match: qry },
                { $sort: { entry: -1 } },
            ]);
            if (req.query.empSubEx) {
                qry.$or = [
                    { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                    { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                ];
            }
            const Bankdata = await bankSchema.findOne({ _id: new mongoose.Types.ObjectId(req.query.bank) });

            const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
                { path: 'bank', select: 'bankName' },
                { path: 'firm', select: 'div_mast' },
                { path: 'bank2', select: 'bankName' },
                { path: 'firm2', select: 'div_mast' },
                { path: 'Applicant', select: 'ACName MobileNo PanNumber', populate: { path: 'CityName', select: 'CityName' } },
                { path: 'CoApplicant', select: 'ACName' },
                { path: 'Guranter', select: 'cutomer_name' },
                { path: 'Make', select: 'Description' },
                { path: 'Model', select: 'Description' },
                { path: 'Variant', select: 'Description' },
                { path: 'Executive', select: 'ACName' },
                { path: 'SubExecutive', select: 'ACName' },
                { path: 'Dealer', select: 'ACName PanNumber' },
                { path: 'SubDealer', select: 'ACName' },
                { path: 'Disbursement_loanType', select: 'CustomerCategory' }
            ]);

            const totals = calculateTotals(populatedEntries);
            const bankTotals = [{
                id: 'Banktotals',
                VehicleNoLimit: Bankdata?.noOfVehicleLimit,
                UsedVehicleNoLimit: populatedEntries.length,
                BankLimit: Bankdata?.limit,
                BankName: Bankdata?.bankName,
                Disbursement_loanAmount: totals.totalLoanAmount,
                remainingLimit: Number(Bankdata?.limit) - Number(totals.totalLoanAmount),
                remainingVehicleLimit: Number(Bankdata?.noOfVehicleLimit) - Number(populatedEntries.length),
            }];

            return res.json({ lastEntryNo: bankTotals });
        } else {
            let result = [];

            for (let bankDetail of AllbankDetails) {
                const qry = {
                    masterid: req.query.masterid,
                    del: "N",
                    Disbursement_date: { $gte: startDate, $lt: endDate },
                    Disbursement_bank: bankDetail._id,
                    Disbursement_limitAmount: { $eq: null },
                    Disbursement_BankLimit: true,
                };
                if (req.query.empSubEx) {
                    qry.$or = [
                        { Executive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                        { SubExecutive: new mongoose.Types.ObjectId(req.query.empSubEx) },
                    ];
                }
                const lastEntryNo = await CustomerApplicationSchema.aggregate([
                    { $match: qry },
                    { $sort: { entry: -1 } },
                ]);

                const populatedEntries = await CustomerApplicationSchema.populate(lastEntryNo, [
                    { path: 'bank', select: 'bankName' },
                    { path: 'firm', select: 'div_mast' },
                    { path: 'bank2', select: 'bankName' },
                    { path: 'firm2', select: 'div_mast' },
                    { path: 'Applicant', select: 'ACName engineNo chasisNo MobileNo PanNumber', populate: { path: 'CityName', select: 'CityName' } },
                    { path: 'CoApplicant', select: 'ACName' },
                    { path: 'Guranter', select: 'cutomer_name' },
                    { path: 'Make', select: 'Description' },
                    { path: 'Model', select: 'Description' },
                    { path: 'Variant', select: 'Description' },
                    { path: 'Executive', select: 'ACName' },
                    { path: 'SubExecutive', select: 'ACName' },
                    { path: 'Dealer', select: 'ACName PanNumber' },
                    { path: 'SubDealer', select: 'ACName' },
                    { path: 'Disbursement_loanType', select: 'CustomerCategory' }
                ]);

                const totals = calculateTotals(populatedEntries);
                const bankTotals = {
                    id: 'Banktotals',
                    VehicleNoLimit: bankDetail.noOfVehicleLimit,
                    UsedVehicleNoLimit: populatedEntries.length,
                    BankLimit: bankDetail.limit,
                    BankName: bankDetail.bankName,
                    Disbursement_loanAmount: totals.totalLoanAmount,
                    remainingLimit: Number(bankDetail.limit) - Number(totals.totalLoanAmount),
                    remainingVehicleLimit: Number(bankDetail.noOfVehicleLimit) - Number(populatedEntries.length),
                };

                result.push(bankTotals);
            }

            return res.json({ lastEntryNo: result });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.bankLimit_Update = async (req, res) => {
    try {
        console.log('req', req.body)
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        const newState = {
            Disbursement_limitAmount: req.body.limitAmount,
            Disbursement_limitRemark: req.body.limitRemark,
            Disbursement_limitMobile: req.body.limitMobile || null,
            Disbursement_documents: req.body.documents,
            update: userDateObject,
            update_datemilisecond: entrydatemilisecond,
        };
        await CustomerApplicationSchema.updateOne({ _id: req.body._id }, newState);

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'CustomerApplicationSchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

// Inquiry
exports.MaxInquiryNo = async (req, res) => {
    try {
        const MaxInquiryNo = await inquirySchema.aggregate([
            { $match: { masterid: req.body.masterid } },
            { $group: { _id: null, Inquryno: { $max: "$Inquryno" } } }
        ]);

        res.json({ MaxInquiryNo: MaxInquiryNo[0]?.Inquryno || 0 });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.Inquiry_Add = async (req, res) => {
    try {

        let Inquiry_mast = new inquirySchema();

        Inquiry_mast.Inquryno = req.body.Inquryno;
        Inquiry_mast.customer = req.body.customer;
        Inquiry_mast.loanAmount = req.body.loanAmount;
        Inquiry_mast.exshowroomPrice = req.body.exshowroomPrice;
        Inquiry_mast.cibilScore = req.body.cibilScore;
        Inquiry_mast.dealer = req.body.dealer;
        Inquiry_mast.remarks = req.body.remarks;
        Inquiry_mast.vehicleNo = req.body.vehicleNo;
        Inquiry_mast.make = req.body.make;
        Inquiry_mast.model = req.body.model;
        Inquiry_mast.variant = req.body.variant;
        Inquiry_mast.variant = req.body.variant;
        Inquiry_mast.status = "Pending";
        if (req.body.date) {
            Inquiry_mast.date = moment(req.body.date).tz("Asia/Kolkata");
            Inquiry_mast.date_datemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
        }

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        Inquiry_mast.user = req.body.user;
        Inquiry_mast.masterid = req.body.masterid;
        Inquiry_mast.entry = userDateObject;
        Inquiry_mast.entry_datemilisecond = entrydatemilisecond;
        Inquiry_mast.del = 'N';

        await Inquiry_mast.save();

        var InquiryuserLog = new user_log;
        InquiryuserLog.user_name = req.body.user;
        InquiryuserLog.module_name = 'inquirySchema';
        InquiryuserLog.user_op = 'A';
        InquiryuserLog.entry_id = Inquiry_mast._id;
        var InquiryuserLog_entry = new Date();
        var userDateObject = moment(InquiryuserLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        InquiryuserLog.entry_date = userDateObject;
        InquiryuserLog.entry_datemilisecond = entrydatemilisecond;
        await InquiryuserLog.save();

        return res.json({ status: true, message: "Inquiry Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.EditInquiry = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        const newState = {
            customer: req.body.customer,
            loanAmount: req.body.loanAmount,
            exshowroomPrice: req.body.exshowroomPrice,
            cibilScore: req.body.cibilScore,
            dealer: req.body.dealer,
            remarks: req.body.remarks,
            vehicleNo: req.body.vehicleNo,
            make: req.body.make,
            model: req.body.model,
            variant: req.body.variant,
            date: moment(req.body.date).tz("Asia/Kolkata"),
            date_datemilisecond: moment(req.body.date).tz("Asia/Kolkata").format('x'),
            user: req.body.user,
            masterid: req.body.masterid,
            update: userDateObject,
            update_datemilisecond: entrydatemilisecond,
            del: 'N'
        };
        // Update existing salary head
        await inquirySchema.updateOne({ _id: req.body._id }, newState);

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'inquirySchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });


    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.InquiryDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await inquirySchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'inquirySchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateFollowUp = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        const followUpRecord = {
            FollowUpremarks: req.body.FollowUpremarks,
            discussion: req.body.discussion,
            followDate: moment(req.body.followDate).tz("Asia/Kolkata"),
            followDate_datemilisecond: moment(req.body.followDate).tz("Asia/Kolkata").format('x')
        };


        const newState = {

            FollowUpremarks: req.body.FollowUpremarks,
            status: req.body.FollowUpstatus,
            discussion: req.body.discussion,
            followDate: moment(req.body.followDate).tz("Asia/Kolkata"),
            followDate_datemilisecond: moment(req.body.followDate).tz("Asia/Kolkata").format('x'),
            user: req.body.user,
            masterid: req.body.masterid,
            update: userDateObject,
            update_datemilisecond: entrydatemilisecond,
            del: 'N'
        };

        await inquirySchema.updateOne(
            { _id: req.body._id },
            {
                $set: newState,
                $push: { FollowUpGroup: followUpRecord }
            }
        );

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'inquirySchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Updated successfully" });


    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.Customer_Add_Inquiry = async (req, res) => {
    try {
        const GroupData = await groupSchema.findOne({ masterid: req.body.masterid, del: "N", GroupName: "Customer" })

        let state_mast = new accountSchema();
        state_mast.cutomer_name = req.body.customerName;
        state_mast.ACName = req.body.customerName;
        state_mast.cutomer_category = req.body.customerCategory;
        state_mast.GroupName = GroupData?._id;
        if (req.body.date) {
            state_mast.date = moment(req.body.date).tz("Asia/Kolkata");
            state_mast.date_datemilisecond = moment(req.body.date).tz("Asia/Kolkata").format('x');
        }
        state_mast.main_bk = "Customer";

        // Present Address  
        state_mast.Address1 = req.body.PresentAddress;
        state_mast.PresentAddressLine2 = req.body.PresentAddressLine2;
        if (req.body.PresentCity) { state_mast.CityName = req.body.PresentCity; }
        state_mast.PresentPhoneNumber = req.body.PresentPhoneNumber;
        state_mast.MobileNo = req.body.PresentMobileNumber;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        await state_mast.save();

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'accountSchema';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Customer Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.InquiryGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let qry;
        if (req.query.Filtterdate) {
            let startDate = req.query.Filtterdate ? new Date(req.query.Filtterdate) : new Date();
            let endDate = req.query.Filtterdate ? new Date(req.query.Filtterdate) : new Date();
            startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
            endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

            startDate.setUTCHours(18, 30, 0, 0);
            startDate.setUTCHours(startDate.getUTCHours());
            endDate.setUTCHours(18, 29, 59, 999);

            endDate.setDate(endDate.getDate());
            startDate.setDate(startDate.getDate() - 1);

            qry = {
                masterid: req.query.masterid,
                del: "N",
                status: 'Pending',
                // followDate: {
                //     $gte: startDate,
                //     $lt: endDate                
                // }
                $or: [
                    { followDate: { $lt: startDate } }, // Records before the startDate
                    { followDate: { $gte: startDate, $lt: endDate } } // Records within the range
                ]
            };
        } else {
            qry = {
                masterid: req.query.masterid,
                del: "N",
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            };
        }

        // const qry = { masterid: req.query.masterid, del: "N", date: { $gte: startDate, $lt: endDate },};
        if (req.query.statusType !== 'All' && !req.query.Filtterdate) {
            qry.status = req.query.statusType;
        }
        console.log(qry)
        const lastEntryNo = await inquirySchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
        ]);

        const populatedEntries = await inquirySchema.populate(lastEntryNo, [
            { path: 'dealer', select: 'ACName' },
            { path: 'make', select: 'Description' },
            { path: 'model', select: 'Description' },
            { path: 'variant', select: 'Description' },
            {
                path: 'customer',
                populate: [
                    { path: 'cutomer_category', select: 'CustomerCategory' },
                    { path: 'GroupName', select: 'GroupName' },
                    { path: 'CityName', select: 'CityName' }
                ]
            }
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.FollowUPcountGET = async (req, res) => {
    try {

        let qry;
        let startDate = new Date();
        let endDate = new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        qry = {
            masterid: req.query.masterid,
            del: "N",
            status: 'Pending',
            $or: [
                { followDate: { $lt: startDate } }, // Records before the startDate
                { followDate: { $gte: startDate, $lt: endDate } } // Records within the range
            ]
        };


        const lastEntryNo = await inquirySchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
        ]);

        // const populatedEntries = await inquirySchema.populate(lastEntryNo, [
        //     { path: 'dealer', select: 'ACName' },
        //     { path: 'make', select: 'Description' },
        //     { path: 'model', select: 'Description' },
        //     { path: 'variant', select: 'Description' },
        //     { 
        //         path: 'customer',
        //         populate: [
        //             { path: 'cutomer_category', select: 'CustomerCategory' },
        //             { path: 'GroupName', select: 'GroupName' },
        //             { path: 'CityName', select: 'CityName' }
        //         ]
        //     }
        // ]);

        res.json({ lastEntryNo: lastEntryNo.length || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.DeleteFollowup = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        const newState = {
            FollowUpGroup: req.body.FollowUpGroup,
            user: req.body.user,
            masterid: req.body.masterid,
            update: userDateObject,
            update_datemilisecond: entrydatemilisecond,
        };
        if (req.body.FollowUpGroup.length === 0) {
            newState.followDate = null;
            newState.followDate_datemilisecond = null;
        }
        // Update existing salary head
        await inquirySchema.updateOne({ _id: req.body._id }, newState);

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'inquirySchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Deleted successfully" });


    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.EditFollowUp = async (req, res) => {
    try {
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        const followUpRecord = {
            "FollowUpGroup.$.FollowUpremarks": req.body.FollowUpremarks,
            "FollowUpGroup.$.discussion": req.body.discussion,
            "FollowUpGroup.$.followDate": moment(req.body.followDate).tz("Asia/Kolkata"),
            "FollowUpGroup.$.followDate_datemilisecond": moment(req.body.followDate).tz("Asia/Kolkata").format('x')
        };
        await inquirySchema.updateOne(
            { _id: req.body._id, "FollowUpGroup._id": req.body.editid },
            {
                $set: {
                    ...followUpRecord,
                    update: userDateObject,
                    update_datemilisecond: entrydatemilisecond
                }
            }
        );

        var userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'inquirySchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body._id;
        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        const FollowUpArray = await inquirySchema.findOne({ masterid: req.body.masterid, del: 'N', _id: req.body._id });
        const lastFollowUp = FollowUpArray.FollowUpGroup[FollowUpArray.FollowUpGroup.length - 1];

        const newState = {
            FollowUpremarks: lastFollowUp.FollowUpremarks || req.body.FollowUpremarks,
            discussion: lastFollowUp.discussion || req.body.discussion,
            followDate: moment(lastFollowUp.followDate),
            followDate_datemilisecond: moment(lastFollowUp.followDate),
        };

        // Update existing salary head
        await inquirySchema.updateOne({ _id: req.body._id }, newState);

        return res.json({ status: true, FollowUpArray, message: "Updated successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.InquiryGraphGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        // let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        let endDate = new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        let qry = {
            masterid: req.query.masterid,
            del: "N",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        };

        console.log(qry)
        const lastEntryNo = await inquirySchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
        ]);

        res.json({ lastEntryNo: lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Expense Master
exports.ExpenseMaster_Add = async (req, res) => {
    try {
        let state_mast = new expenseSchema();
        state_mast.HeadName = req.body.HeadName;
        state_mast.DueDate = req.body.DueDate;
        state_mast.GroupName = req.body.GroupName;
        state_mast.type = req.body.type;

        var userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');
        state_mast.user = req.body.user;
        state_mast.masterid = req.body.masterid;
        state_mast.entry = userDateObject;
        state_mast.entry_datemilisecond = entrydatemilisecond;
        state_mast.del = 'N';

        if (req.body._id) {
            const existingemployeegrade_master = await expenseSchema.findOne({ HeadName: req.body.HeadName, masterid: req.body.masterid });

            if (existingemployeegrade_master && existingemployeegrade_master._id.toString() !== req.body._id && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Head Name " });
            }

            const newState = {
                HeadName: req.body.HeadName,
                DueDate: req.body.DueDate,
                GroupName: req.body.GroupName,
                type: req.body.type,

                user: req.body.user,
                masterid: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
                del: 'N'
            };
            // Update existing salary head
            await expenseSchema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'expenseSchema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        } else {
            const existingemployeegrade_master = await expenseSchema.findOne({ HeadName: req.body.HeadName, masterid: req.body.masterid });
            if (existingemployeegrade_master && existingemployeegrade_master.del === 'N') {
                return res.json({ status: false, message: "Duplicate Head Name" });
            }
            await state_mast.save();
            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'expenseSchema';
            userLog.user_op = 'A';
            userLog.entry_id = state_mast._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Added successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.ExpenseMasterGET = async (req, res) => {
    try {
        const qry = { masterid: req.query.masterid, del: "N" };
        const lastEntryNo = await expenseSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } },
            // { $skip: (page - 1) * rowsPerPage },
            // { $limit: rowsPerPage }, 
            // { $project: { Description: "$Description", Code: "$Code" } }
        ]);

        const populatedEntries = await expenseSchema.populate(lastEntryNo, [
            { path: 'GroupName', select: 'GroupName' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ExpenseMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await expenseSchema.updateOne({ _id: req.params.id }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'expenseSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ExpenseTypeGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, del: "N" }
        const lastEntryNo = await expenseSchema.aggregate([
            { $match: qry },
            { $project: { HeadName: "$HeadName", } }
        ]);

        return res.json({ status: true, lastEntryNo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Payment
exports.PaymentTransGET = async (req, res) => {
    try {
        let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        qry = {
            masterid: req.body.masterid,
            expense: new mongoose.Types.ObjectId(req.body.expense),
            d_c: 'Credit',
            main_bk: 'JR',
            type: `${req.body.type}A`,
            cash_date: {
                $gte: startDate,
                $lt: endDate
            }
            // main_bk: 'jr'
        };
        if (req.body.Statustype === 'Pending') {
            qry.paid = 'No';
        }
        if (req.body.Statustype === 'Paid') {
            qry.paid = 'Yes';
        }
        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { entry: 1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            // { path: 'expense'},
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.PaymentCBUpdate = async (req, res) => {
    try {
        const { expense, BankAC, PaymentDate, Rows, SelectTotal } = req.body;
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        let state_mast = new transSchema();
        // state_mast.application_id = item.application_id;
        state_mast.cashac_name = BankAC?._id;
        state_mast.cashoppac_name = BankAC?._id;
        state_mast.expense = expense?._id;
        state_mast.main_bk = 'CB';
        state_mast.c_j_s_p = 'CB';
        // state_mast.c_j_s_p = `${expense?.HeadName}CB`;
        state_mast.d_c = "Debit";
        if (expense?.HeadName === 'RTO') {
            state_mast.srno = 2;
        }
        if (expense?.HeadName === 'OTHER') {
            state_mast.srno = 3;
        }
        state_mast.type = "Payment";
        // state_mast.narration = item?.narration;
        state_mast.cash_amount = Number(SelectTotal);
        state_mast.cash_date = moment(PaymentDate).tz("Asia/Kolkata").toDate();
        state_mast.cash_edatemilisecond = moment(PaymentDate).tz("Asia/Kolkata").format('x');
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        await state_mast.save();

        Rows.forEach(async (item) => {
            const newState = {
                paid: "Yes",
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item?._id) }, newState);

            let state_mast2 = new transSchema();
            state_mast2.application_id = item.application_id;
            state_mast2.cashac_name = item.cashac_name;
            state_mast2.expense = expense?._id;
            state_mast2.cashoppac_name = BankAC?._id;
            state_mast2.main_bk = 'CB';
            state_mast2.c_j_s_p = 'CB';
            state_mast2.type = 'Payment';
            state_mast2.d_c = "Debit";
            state_mast2.srno = item?.srno;
            // state_mast2.type = "Receipt";
            state_mast2.narration = item?.narration;
            // state_mast2.paid = 'Yes';
            state_mast2.cash_amount = Number(item?.cash_amount);
            state_mast2.cash_date = moment(PaymentDate).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(PaymentDate).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;
            await state_mast2.save();

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'Add';
            userLog.entry_id = state_mast2._id;

            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

        });

        const userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'transSchema';
        userLog.user_op = 'U';
        userLog.entry_id = state_mast._id;

        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Payment records updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.PaymentCBADD = async (req, res) => {
    try {
        const { BankAC, PaymentDate, narration, narration2, amount, account } = req.body;
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        let state_mast2 = new transSchema();
        state_mast2.application_id = req.body._id;
        state_mast2.cashac_name = account;
        state_mast2.cashoppac_name = BankAC;
        state_mast2.main_bk = 'CB';
        state_mast2.c_j_s_p = 'PAY';
        state_mast2.type = 'Payment';
        state_mast2.d_c = "Debit";
        state_mast2.narration = narration;
        state_mast2.narration2 = narration2;
        state_mast2.paid = 'Yes';
        state_mast2.cash_amount = Number(amount);
        state_mast2.cash_date = moment(PaymentDate).tz("Asia/Kolkata").toDate();
        state_mast2.cash_edatemilisecond = moment(PaymentDate).tz("Asia/Kolkata").format('x');
        state_mast2.masterid = req.body.masterid;
        state_mast2.co_code = req.body.compid;
        state_mast2.div_code = req.body.divid;
        await state_mast2.save();

        const userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'transSchema';
        userLog.user_op = 'Add';
        userLog.entry_id = state_mast2._id;

        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Payment records updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CustomerApplicationsAccountsGET = async (req, res) => {
    try {
        const searchQuery = req.query.query || ''; // Capture the search query
        const regex = new RegExp(searchQuery, 'i'); // Create a case-insensitive regex

        const qry = {
            masterid: req.query.masterid,
            del: "N",
            $or: [
                { 'ACName': regex },
                { 'cutomer_name': regex },
            ]
        };

        const lastEntryNo = await accountSchema.aggregate([
            { $match: qry },
            // { $sort: { ACName: 1 } },
            {
                $project: {
                    ACName: 1,
                    GroupName: 1,
                    Alias: 1,
                    PanNumber: 1,
                    CityName: 1,
                    StateName: 1,
                    MobileNo: 1,
                    Address1: 1,
                    GSTIN: 1,
                    AadharNumber: 1,
                    ac_bank: 1,
                    _id: 1 // Include _id to match with transSchema
                }
            },
            { $limit: 10 } // Limit the result to 10 documents

        ]);

        const populatedEntries = await accountSchema.populate(lastEntryNo, [
            { path: 'StateName', select: 'StateName' },
            { path: 'CityName', select: 'CityName' },
            { path: 'GroupName', select: 'GroupName Address' } // Include Address field from GroupName
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Cash Bank Module
exports.maxRecCBNo = async (req, res) => {
    try {
        const ApplicationNo = await transSchema.aggregate([
            { $match: { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, main_bk: req.body.RecType } }, // Filter for c_j_s_p being 'CB'
            { $group: { _id: null, vouc_code: { $max: "$vouc_code" } } }
        ]);

        let startDate = req.body.PaymentDate ? new Date(req.body.PaymentDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        startDate.setDate(startDate.getDate() - 1);

        const qry = { group: 'Cash Bank', user: req.body.masterid };
        const lastEntryNo = await voucher_setup_schema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const filteredData = lastEntryNo[0]?.garry.filter(item =>
            (item.Ldate === null || new Date(item.Ldate) >= new Date(startDate)) && item.active === 'Y' && item.book === req.body.RecType && // Handle null Ldate
            item.division.map(divisionId => divisionId.toString()).includes(req.body.divid)  // Convert ObjectId to string for comparison
        );

        res.json({ maxNo: ApplicationNo[0]?.vouc_code + 1 || 1, filteredData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.maxRecBKNo = async (req, res) => {
    try {
        const ApplicationNo = await transSchema.aggregate([
            { $match: { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, main_bk: 'BK' } }, // Filter for c_j_s_p being 'CB'
            { $group: { _id: null, vouc_code: { $max: "$vouc_code" } } }
        ]);

        res.json({ maxNo: ApplicationNo[0]?.vouc_code + 1 || 1 });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.CashBankModule = async (req, res) => {
    try {
        const { expense, BankAC, PaymentDate, Rows, SelectTotal, c_j_s_p, Type, vou_code } = req.body;
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        let state_mast = new transSchema();
        // state_mast.application_id = item.application_id;
        state_mast.cashac_name = BankAC?._id;
        state_mast.cashoppac_name = Type === 'Contra' ? Rows[0]?.name?._id : Rows[0]?.name?._id;
        state_mast.main_bk = 'CB';
        state_mast.c_j_s_p = c_j_s_p;
        state_mast.vouc_code = vou_code;

        state_mast.d_c = Type === 'Payment' ? "Credit" : 'Debit';
        // state_mast.c_j_s_p = `${expense?.HeadName}CB`;

        state_mast.type = Type;
        // state_mast.narration = item?.narration;
        state_mast.cash_amount = Number(SelectTotal);
        state_mast.cash_date = moment(PaymentDate).tz("Asia/Kolkata").toDate();
        state_mast.cash_edatemilisecond = moment(PaymentDate).tz("Asia/Kolkata").format('x');
        state_mast.masterid = req.body.masterid;
        state_mast.co_code = req.body.compid;
        state_mast.div_code = req.body.divid;
        state_mast.del = 'N';
        await state_mast.save();

        Rows.forEach(async (item) => {

            let state_mast2 = new transSchema();
            state_mast2.cashac_name = item.name?._id;
            state_mast2.cashoppac_name = BankAC?._id;
            state_mast2.main_bk = 'CB';
            state_mast2.c_j_s_p = c_j_s_p;
            state_mast2.type = Type;
            state_mast2.d_c = Type !== 'Payment' ? "Credit" : 'Debit';
            state_mast2.cash_chequeno = item?.chequeNo;
            state_mast2.vouc_code = vou_code;

            // state_mast2.srno = item?.srno;
            // state_mast2.type = "Receipt";
            state_mast2.narration = item?.narration1;
            state_mast2.narration2 = item?.narration2;
            // state_mast2.paid = Type === 'Contra'?'':'Yes';
            state_mast2.cash_amount = Number(item?.amount);
            state_mast2.cash_date = moment(PaymentDate).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(PaymentDate).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;
            state_mast.del = 'N';
            await state_mast2.save();

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'Add';
            userLog.entry_id = state_mast2._id;

            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

        });

        const userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'transSchema';
        userLog.user_op = 'A';
        userLog.entry_id = state_mast._id;
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Payment records Added successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CashBankModuleAccountsGET = async (req, res) => {
    try {
        const bankLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Bank", user: req.query.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Step 2: Find the latest entry for "Cash" group
        const cashLastEntry = await group_setup_schema.aggregate([
            { $match: { group: "Cash", user: req.query.masterid } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
            { $project: { garry: 1, _id: 0 } }
        ]);

        // Combine the garry arrays from both results
        const combinedGarry = [
            ...(bankLastEntry[0]?.garry || []),
            ...(cashLastEntry[0]?.garry || [])
        ];
        console.log("&&&&", combinedGarry)
        const searchQuery = req.query.query || ''; // Capture the search query
        const regex = new RegExp(searchQuery, 'i'); // Create a case-insensitive regex

        const qry = {
            masterid: req.query.masterid,
            del: "N",
            GroupName: combinedGarry.length ? { $nin: combinedGarry } : {},
            $or: [
                { 'ACName': regex },
                { 'cutomer_name': regex },
            ]
        };

        if (req.query.group && req.query.group.length > 0) {
            const groupIds = req.query.group.map(groupId => new mongoose.Types.ObjectId(groupId));
            qry.GroupName = { $in: groupIds };
        }
        console.log(qry)
        const lastEntryNo = await accountSchema.aggregate([
            { $match: qry },
            // { $sort: { ACName: 1 } },
            {
                $project: {
                    ACName: 1,
                    GroupName: 1,
                    Alias: 1,
                    PanNumber: 1,
                    CityName: 1,
                    StateName: 1,
                    MobileNo: 1,
                    Address1: 1,
                    GSTIN: 1,
                    AadharNumber: 1,
                    ac_bank: 1,
                    _id: 1 // Include _id to match with transSchema
                }
            },
            { $limit: 10 } // Limit the result to 10 documents

        ]);

        const populatedEntries = await accountSchema.populate(lastEntryNo, [
            { path: 'StateName', select: 'StateName' },
            { path: 'CityName', select: 'CityName' },
            { path: 'GroupName', select: 'GroupName Address' } // Include Address field from GroupName
        ]);

        // Fetch d_c and cash_amount from transSchema for each populated entry
        const entriesWithTransData = await Promise.all(populatedEntries.map(async (entry) => {
            const transData = await transSchema.findOne({ cashac_name: entry._id }, { d_c: 1, cash_amount: 1 });
            return {
                ...entry,
                transData: transData ? transData.toObject() : {}
            };
        }));

        const totalCount = entriesWithTransData.length;

        res.json({ totalCount, lastEntryNo: entriesWithTransData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CashBankModuleUpdate = async (req, res) => {
    try {
        const { expense, BankAC, PaymentDate, Rows, SelectTotal, c_j_s_p, Type, vou_code, deletedRowIds } = req.body;
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        deletedRowIds.forEach(async (item) => {
            let state_mast2 = {
                del: 'Y'
            };
            await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item) }, state_mast2);

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'D';
            userLog.entry_id = item;
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
        });

        let state_mast = {
            cashac_name: BankAC?._id,
            cashoppac_name: Type === 'Contra' ? Rows[0]?.name?._id : Rows[0]?.name?._id,
            main_bk: 'CB',
            c_j_s_p: c_j_s_p,
            vouc_code: vou_code,
            d_c: Type !== 'Payment' ? "Debit" : 'Credit',
            type: Type,
            cash_amount: Number(SelectTotal),
            cash_date: moment(PaymentDate).tz("Asia/Kolkata").toDate(),
            cash_edatemilisecond: moment(PaymentDate).tz("Asia/Kolkata").format('x'),
            masterid: req.body.masterid,
            co_code: req.body.compid,
            div_code: req.body.divid,
            del: 'N'
        };

        await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(req.body.editID) }, state_mast);

        // await state_mast.save();

        Rows.forEach(async (item) => {

            let state_mast2 = {
                cashac_name: item.name?._id,
                cashoppac_name: BankAC?._id,
                main_bk: 'CB',
                c_j_s_p: c_j_s_p,
                type: Type,
                d_c: Type !== 'Payment' ? "Credit" : 'Debit',
                cash_chequeno: item?.chequeNo,
                vouc_code: vou_code,
                narration: item?.narration1,
                narration2: item?.narration2,
                paid: Type === 'Contra' ? '' : 'Yes',
                cash_amount: Number(item?.amount),
                cash_date: moment(PaymentDate).tz("Asia/Kolkata").toDate(),
                cash_edatemilisecond: moment(PaymentDate).tz("Asia/Kolkata").format('x'),
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                del: 'N'
            };

            // await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item._id) }, state_mast2);

            if (item._id) {
                await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item._id) }, state_mast2);
            } else {
                const newTransaction = new transSchema(state_mast2);
                await newTransaction.save();

                item._id = newTransaction._id;
            }

            // await state_mast2.save();

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'U';
            userLog.entry_id = item._id;

            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

        });

        const userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'transSchema';
        userLog.user_op = 'U';
        userLog.entry_id = req.body.editID;
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Payment records Updated successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error.message });
    }
};

exports.CashBankModuleGETVoucheCode = async (req, res) => {
    try {
        const qry = {
            masterid: req.query.masterid,
            div_code: req.query.divid,
            co_code: req.query.compid,
            main_bk: 'CB',
            del: { $ne: "Y" }, // del not equal to "Y"
            vouc_code: Number(req.query.VoucheCode)
        };
        console.log(qry)
        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { cash_date: -1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CashBankModuleListGET = async (req, res) => {
    try {
        const qry = {
            masterid: req.query.masterid,
            div_code: req.query.divid,
            co_code: req.query.compid,
            main_bk: 'CB', // main_bk not equal to "Customer"
            del: { $ne: "Y" } // del not equal to "Y"
        };
        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { cash_date: -1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CashBankModuleDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await transSchema.updateMany({
            masterid: req.body.masterid,
            div_code: req.body.divid,
            co_code: req.body.compid,
            vouc_code: Number(req.params.id),
            c_j_s_p: req.body.c_j_s_p
        }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'transSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// JV Module

// exports.maxRecJVNo = async (req, res) => {
//     try {
//         const ApplicationNo = await transSchema.aggregate([
//             { $match: { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, main_bk: req.body.RecType } }, // Filter for c_j_s_p being 'CB'
//             { $group: { _id: null, vouc_code: { $max: "$vouc_code" } } }
//         ]);

//         res.json({ maxNo: ApplicationNo[0]?.vouc_code + 1 || 1 });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

exports.maxRecJVNo = async (req, res) => {
    try {
        const ApplicationNo = await transSchema.aggregate([
            { $match: { div_code: req.body.divid, co_code: req.body.compid, masterid: req.body.masterid, main_bk: req.body.RecType } }, // Filter for c_j_s_p being 'CB'
            { $group: { _id: null, vouc_code: { $max: "$vouc_code" } } }
        ]);

        let startDate = req.body.PaymentDate ? new Date(req.body.PaymentDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        startDate.setDate(startDate.getDate() - 1);

        const qry = { group: 'Journal Entry', user: req.body.masterid };
        const lastEntryNo = await voucher_setup_schema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        const filteredData = lastEntryNo[0]?.garry.filter(item =>
            (item.Ldate === null || new Date(item.Ldate) >= new Date(startDate)) && item.active === 'Y' && item.book === req.body.RecType && // Handle null Ldate
            item.division.map(divisionId => divisionId.toString()).includes(req.body.divid)  // Convert ObjectId to string for comparison
        );


        res.json({ maxNo: ApplicationNo[0]?.vouc_code + 1 || 1, filteredData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.AddJVModule = async (req, res) => {
    try {
        const { PaymentDate, Rows, c_j_s_p, Type, vou_code } = req.body;
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        const firstDebit = Rows.find(row => row?.DC === 'Debit')?.Account?._id;
        const firstCredit = Rows.find(row => row?.DC === 'Credit')?.Account?._id;

        Rows.forEach(async (item) => {

            let state_mast2 = new transSchema();
            if (item.DC === 'Credit') {
                state_mast2.cashoppac_name = firstDebit;  // If current row's DC is 'Credit', use the first 'Debit' row's _id
            } else if (item.DC === 'Debit') {
                state_mast2.cashoppac_name = firstCredit;  // If current row's DC is 'Debit', use the first 'Credit' row's _id
            }

            state_mast2.cashac_name = item?.Account?._id;
            // state_mast2.cashoppac_name = BankAC?._id;
            state_mast2.main_bk = 'JV';
            state_mast2.c_j_s_p = c_j_s_p;
            state_mast2.type = 'General';
            state_mast2.d_c = item?.DC;
            state_mast2.vouc_code = vou_code;

            // state_mast2.srno = item?.srno;
            // state_mast2.type = "Receipt";
            state_mast2.narration = item?.narration1;
            state_mast2.narration2 = item?.narration2;
            // state_mast2.paid = Type === 'Contra'?'':'Yes';
            state_mast2.cash_amount = item.DC === 'Debit' ? Number(item?.Debit) : Number(item?.Credit);
            state_mast2.cash_date = moment(PaymentDate).tz("Asia/Kolkata").toDate();
            state_mast2.cash_edatemilisecond = moment(PaymentDate).tz("Asia/Kolkata").format('x');
            state_mast2.masterid = req.body.masterid;
            state_mast2.co_code = req.body.compid;
            state_mast2.div_code = req.body.divid;
            state_mast2.del = 'N';
            await state_mast2.save();

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'Add';
            userLog.entry_id = state_mast2._id;

            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

        });

        return res.json({ status: true, message: "Records Added successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error.message });
    }
};

exports.JVListGET = async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const qry = {
            masterid: req.query.masterid,
            div_code: req.query.divid,
            co_code: req.query.compid,
            main_bk: 'JV', // main_bk not equal to "Customer"
            del: { $ne: "Y" }, // del not equal to "Y"
            cash_date: {
                $gte: startDate,
                $lt: endDate
            }
        };
        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { cash_date: -1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.JVListGETNos = async (req, res) => {
    try {
        let startno = parseInt(req.query.startno);
        let endno = parseInt(req.query.endno);
        let c_j_s_p = req.query.c_j_s_p;

        const qry = {
            masterid: req.query.masterid,
            div_code: req.query.divid,
            co_code: req.query.compid,
            c_j_s_p: req.query.c_j_s_p,
            main_bk: 'JV', // main_bk not equal to "Customer"
            del: { $ne: "Y" }, // del not equal to "Y"
            vouc_code: {
                $gte: startno,
                $lte: endno
            }
        };
        
        console.log(qry);

        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { cash_date: -1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.JVModuleDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await transSchema.updateMany({
            masterid: req.body.masterid,
            div_code: req.body.divid,
            co_code: req.body.compid,
            vouc_code: Number(req.params.id),
            c_j_s_p: req.body.c_j_s_p
        }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'transSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.JVModuleGETVoucheCode = async (req, res) => {
    try {
        const qry = {
            masterid: req.query.masterid,
            div_code: req.query.divid,
            co_code: req.query.compid,
            main_bk: 'JV',
            del: { $ne: "Y" }, // del not equal to "Y"
            vouc_code: Number(req.query.VoucheCode)
        };
        console.log(qry)
        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { cash_date: -1 } },
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
        ]);

        res.json({ lastEntryNo: populatedEntries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.JVModuleUpdate = async (req, res) => {
    try {
        const { PaymentDate, Rows, c_j_s_p, Type, vou_code, deletedRowIds } = req.body;
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        deletedRowIds.forEach(async (item) => {
            let state_mast2 = {
                del: 'Y'
            };
            await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item) }, state_mast2);

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'D';
            userLog.entry_id = item;
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();
        });
        // await state_mast.save();

        const firstDebit = Rows.find(row => row?.DC === 'Debit')?.Account?._id;
        const firstCredit = Rows.find(row => row?.DC === 'Credit')?.Account?._id;

        Rows.forEach(async (item) => {

            let state_mast2 = {
                cashac_name: item.Account?._id,
                cashoppac_name: item.DC === 'Debit' ? firstCredit : firstDebit,
                main_bk: 'JV',
                c_j_s_p: c_j_s_p,
                type: 'General',
                d_c: item?.DC,
                vouc_code: vou_code,
                narration: item?.narration1,
                narration2: item?.narration2,
                paid: Type === 'Contra' ? '' : 'Yes',
                cash_amount: item.DC === 'Debit' ? Number(item?.Debit) : Number(item?.Credit),
                cash_date: moment(PaymentDate).tz("Asia/Kolkata").toDate(),
                cash_edatemilisecond: moment(PaymentDate).tz("Asia/Kolkata").format('x'),
                masterid: req.body.masterid,
                co_code: req.body.compid,
                div_code: req.body.divid,
                del: 'N'
            };

            // await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item._id) }, state_mast2);

            if (item._id) {
                await transSchema.updateOne({ _id: new mongoose.Types.ObjectId(item._id) }, state_mast2);
            } else {
                const newTransaction = new transSchema(state_mast2);
                await newTransaction.save();

                item._id = newTransaction._id;
            }

            // await state_mast2.save();

            const userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'transSchema';
            userLog.user_op = 'U';
            userLog.entry_id = item._id;

            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

        });

        return res.json({ status: true, message: "Records Updated successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error.message });
    }
};

exports.DealerReportGET = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, seacrhString } = req.query;  // Default values
        const pageNumber = parseInt(page, 10);
        const regex = new RegExp(seacrhString, 'i'); // Create a case-insensitive regex

        const isAll = pageSize === 99;
        const pageLimit = isAll ? 0 : parseInt(pageSize, 10);  // If 'All', set pageLimit to 0 (no limit)
        const skip = isAll ? 0 : (pageNumber - 1) * pageLimit; // If 'All', skip nothing

        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        endDate.setUTCHours(18, 29, 59, 999);

        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() - 1);

        const qry = {
            // masterid: req.query.masterid,
            div_code: req.query.divid,
            co_code: req.query.compid,
            // main_bk: 'CB',
            del: { $ne: "Y" },
            $or: [
                { Dealer_name: { $exists: true } },
                { Dealer_name: { $ne: null } }
            ],
            cash_date: {
                $gte: startDate,
                $lt: endDate
            }
        };

        if (seacrhString) {
            const lastEntryNoDeal = await group_setup_schema.aggregate([
                { $match: { group: "Dealer", user: req.query.masterid } },
                { $sort: { _id: -1 } },
                {
                    $project: {
                        garry: 1,
                        _id: 1
                    }
                }
            ]);
            const qryDeal = {
                masterid: req.query.masterid,
                del: "N",
                _id: { $in: lastEntryNoDeal[0].garry ? lastEntryNoDeal[0].garry : [] }
            };

            const result = await groupSchema.aggregate([
                { $match: qryDeal },
                { $sort: { entry: -1 } },
                { $project: { GroupName: 1, _id: 1, } }
            ]);

            const groupIds = result.map(item => item._id);

            const AdvanceQry = {
                masterid: req.query.masterid,
                del: "N",
                GroupName: { $in: groupIds },
                $or: [
                    { ACName: regex },
                    { MobileNo: regex },
                ]
            };

            const results = await accountSchema.aggregate([
                { $match: AdvanceQry },
                { $sort: { entry: -1 } },
                { $project: { ACName: 1, _id: 1 } }
            ]);

            // const designation = await accountSchema.find(SeachQry);
            const designationarr = results.map(d => d._id);
            qry.Dealer_name = { $in: designationarr }
        }


        const lastEntryNo = await transSchema.aggregate([
            { $match: qry },
            { $sort: { cash_date: -1 } },
            { $skip: req.query.pageSize == 99 ? 0 : skip },
            { $limit: req.query.pageSize == 99 ? 500 : pageLimit }
        ]);

        const populatedEntries = await transSchema.populate(lastEntryNo, [
            { path: 'cashac_name', select: 'ACName' },
            { path: 'cashoppac_name', select: 'ACName' },
            { path: 'Dealer_name', select: 'ACName' },
            { path: 'application_id', select: 'VehicleNo' },
        ]);
        const totalDocuments = await transSchema.countDocuments(qry);

        res.json({ lastEntryNo: populatedEntries, totalDocuments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Voucer Master
exports.VoucerMasterAdd = async (req, res) => {
    try {
        const userLog_entry = new Date();
        var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var entrydatemilisecond = userDateObject.format('x');

        const processedRows = req.body.Rows.map(row => {
            if (row.Ldate) {
                const formattedLdate = moment(row?.Ldate).tz("Asia/Kolkata").toDate();
                row.Ldate = isNaN(formattedLdate.getTime()) ? null : formattedLdate;
            }
            if (row?.division?._id) {
                row.division = row?.division?._id;
            }
            return row;
        });

        let state_mast = {
            ModuleName: req.body.ModuleName,
            vouchArray: processedRows,
            masterid: req.body.masterid,
            del: 'N',
            entry: userDateObject,
            entry_datemilisecond: entrydatemilisecond
        };

        if (req.body._id) {
            await voucerMasterSchema.updateOne({ _id: new mongoose.Types.ObjectId(req.body._id) }, state_mast);
        } else {
            const voucerMaster = new voucerMasterSchema(state_mast);
            await voucerMaster.save();
        }

        const userLog = new user_log;
        userLog.user_name = req.body.user;
        userLog.module_name = 'voucerMasterSchema';
        userLog.user_op = 'Add';
        userLog.entry_id = state_mast._id;

        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Voucer Added successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: error.message });
    }
}

exports.VoucerMasterListGET = async (req, res) => {
    try {
        const qry = {
            masterid: req.query.masterid,
            del: { $ne: "Y" }, // del not equal to "Y"
        };

        const lastEntryNo = await voucerMasterSchema.aggregate([
            { $match: qry },
            { $sort: { entry: -1 } }
        ]);

        if (lastEntryNo.length > 0) {
            const populatedEntries = await voucerMasterSchema.find({ _id: { $in: lastEntryNo.map(entry => entry._id) } })
                .populate({
                    path: 'vouchArray.division',
                    select: 'div_mast'
                });

            res.json({ lastEntryNo: populatedEntries });
        } else {
            res.json({ lastEntryNo: [] });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VoucerMasterDELETE = async (req, res) => {
    var state_mast_entry = new Date();
    var entryDateObject = moment(state_mast_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
    var entrydatemilisecond = entryDateObject.format('x');
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: entryDateObject,
            delete_datemilisecond: entrydatemilisecond,
            del: 'Y'
        };

        // Update the document with the given _id
        await voucerMasterSchema.updateMany({
            masterid: req.body.masterid,
            _id: req.params.id
        }, state_mast);

        // Log the user operation
        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'voucerMasterSchema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: entryDateObject,
            entry_datemilisecond: entrydatemilisecond
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting Item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VoucherSetupTypesWithIDGET = async (req, res) => {
    try {
        const qry = { user: req.query.masterid };
        const result = await voucher_setup_schema.aggregate([
            { $match: qry },
            { $sort: { group: -1 } },
            { $project: { group: 1, _id: 1 } }
        ]);

        // Extract GroupName into an array
        const totalCount = result.length;

        res.json({ totalCount, groupNames: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VoucherSetupGET = async (req, res) => {
    try {
        const qry = { group: req.query.ID, user: req.query.masterid };
        const lastEntryNo = await voucher_setup_schema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);

        console.log('ii', lastEntryNo[0]?.garry)
        // // Populating the entries with the related GroupName from groupSchema
        // const populatedEntries = await group_setup_schema.populate(lastEntryNo, {
        //     path: 'garry.division',
        //     select: 'div_mast'
        // });

        const totalCount = lastEntryNo.length;

        res.json({ totalCount, lastEntryNo: lastEntryNo, gar: lastEntryNo[0]?.garry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VoucherSetup_Add = async (req, res) => {
    try {
        if (req.body._id) {
            console.log(req.body.garry)
            const processedRows = req.body.garry.map(row => {
                if (row.Ldate) {
                    const formattedLdate = moment(row?.Ldate).tz("Asia/Kolkata").toDate();
                    row.Ldate = isNaN(formattedLdate.getTime()) ? null : formattedLdate;
                }
                if (Array.isArray(row?.division) && row.division.length > 0) {
                    row.division = row.division.map(div => {
                        if (div?._id && mongoose.isValidObjectId(div._id)) {
                            div.push = div._id; // Store _id to 'push'
                        }
                        return div; // Return the processed division object
                    });
                }

                return row;
            });

            const newState = {
                garry: processedRows,
                user: req.body.masterid,
                update: userDateObject,
                update_datemilisecond: entrydatemilisecond,
            };
            // Update existing salary head
            await voucher_setup_schema.updateOne({ _id: req.body._id }, newState);

            var userLog = new user_log;
            userLog.user_name = req.body.user;
            userLog.module_name = 'voucher_setup_schema';
            userLog.user_op = 'U';
            userLog.entry_id = req.body._id;
            var userLog_entry = new Date();
            var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
            var entrydatemilisecond = userDateObject.format('x');
            userLog.entry_date = userDateObject;
            userLog.entry_datemilisecond = entrydatemilisecond;
            await userLog.save();

            return res.json({ status: true, message: "Updated successfully" });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.VoucherSetupNames_Add = async (req, res) => {
    try {
        // Extract the data to be inserted
        const data = [
            { group: "Cash Bank", garry: [] },
            { group: "Journal Entry", garry: [] },
        ];

        for (const item of data) {
            const newState = {
                group: item.group,
                user: req.body.masterid,
                garry: item.garry,
            };

            // Check if an entry with the same group and user already exists
            const existingGroup = await voucher_setup_schema.findOne({
                group: newState.group,
                user: req.body.masterid
            });

            if (!existingGroup) {
                // If it doesn't exist, insert the new entry into the database
                const createdEntry = await voucher_setup_schema.create(newState);
            }
        }

        // Create a new user log entry
        const userLog = new user_log();
        userLog.user_name = req.body.user;
        userLog.module_name = 'voucher_setup_schema';
        userLog.user_op = 'A';
        userLog.entry_id = req.body.user;
        const userLog_entry = new Date();
        const userDateObject = moment(userLog_entry).tz("Asia/Kolkata");
        const entrydatemilisecond = userDateObject.format('x');
        userLog.entry_date = userDateObject;
        userLog.entry_datemilisecond = entrydatemilisecond;
        await userLog.save();

        return res.json({ status: true, message: "Added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};

exports.VoucherJVGET = async (req, res) => {
    try {
        // const dateX = moment(req.query.PaymentDate, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");

        let startDate = req.query.PaymentDate ? new Date(req.query.PaymentDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        startDate.setDate(startDate.getDate() - 1);

        console.log(startDate);

        const qry = { group: 'Journal Entry', user: req.query.masterid };
        const lastEntryNo = await voucher_setup_schema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);
        // const filteredData = lastEntryNo[0]?.garry.filter(item => 
        //     new Date(item?.Ldate) <= new Date(startDate) &&
        //     item?.division?.map(divisionId => divisionId.toString()).includes(req.query.divid)
        // );        
        const filteredData = lastEntryNo[0]?.garry.filter(item =>
            (item.Ldate === null || new Date(item.Ldate) >= new Date(startDate)) && item.active === 'Y' &&  // Handle null Ldate
            item.division.map(divisionId => divisionId.toString()).includes(req.query.divid)  // Convert ObjectId to string for comparison
        );
        // Output the descriptions of matching items
        const descriptions = filteredData.map(item => item?.book);

        res.json({ descriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.VoucherCBGET = async (req, res) => {
    try {
        // const dateX = moment(req.query.PaymentDate, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");

        let startDate = req.query.PaymentDate ? new Date(req.query.PaymentDate) : new Date();
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);

        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours());
        startDate.setDate(startDate.getDate() - 1);

        console.log(startDate);

        const qry = { group: 'Cash Bank', user: req.query.masterid };
        const lastEntryNo = await voucher_setup_schema.aggregate([
            { $match: qry },
            { $sort: { _id: -1 } },
            {
                $project: {
                    garry: 1,
                    _id: 1
                }
            }
        ]);
        // const filteredData = lastEntryNo[0]?.garry.filter(item => 
        //     new Date(item?.Ldate) <= new Date(startDate) &&
        //     item?.division?.map(divisionId => divisionId.toString()).includes(req.query.divid)
        // );        
        const filteredData = lastEntryNo[0]?.garry.filter(item =>
            (item.Ldate === null || new Date(item.Ldate) >= new Date(startDate)) && item.active === 'Y' &&  // Handle null Ldate
            item.division.map(divisionId => divisionId.toString()).includes(req.query.divid)  // Convert ObjectId to string for comparison
        );
        // Output the descriptions of matching items
        const descriptions = filteredData.map(item => item?.book);

        res.json({ descriptions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Change Password

exports.changePassword = async (req, res) => {
    try {
        const { usrnm, masterid, currentPassword, newPassword, empSubEx } = req.body;

        if (!empSubEx) {
            const user = await User.findOne({ masterid, usrnm: { $regex: new RegExp('^' + usrnm + '$', 'i') } });

            if (!user) {
                return res.json({ status: false, message: 'User not found' });
            }

            if (currentPassword !== user.usrpwd) {
                return res.json({ status: false, message: 'Invalid current password' });
            }
            await User.updateOne({ _id: user._id }, { usrpwd: newPassword });
            return res.json({ status: true, message: 'Password updated successfully' });

        } else {
            const employeeMaster = await accountSchema.findOne({ _id: empSubEx, masterid });

            if (!employeeMaster) {
                return res.json({ status: false, message: 'Employee not found' });
            }

            if (currentPassword !== employeeMaster.usrpwd) {
                return res.json({ status: false, message: 'Invalid current password' });
            }
            await accountSchema.updateOne({ _id: employeeMaster._id }, { usrpwd: newPassword });
            return res.json({ status: true, message: 'Password updated successfully' });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.json({ status: false, message: error.message });
    }
};
