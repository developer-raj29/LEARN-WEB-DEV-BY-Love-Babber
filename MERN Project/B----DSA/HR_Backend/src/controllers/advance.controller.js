const dailyatten_mast = require('../models/attenSchema.js');
const designation_master = require('../models/designationSchema.js');
const department_master = require('../models/department_master_Schema.js');
const employee_master = require('../models/employeeSchema.js');
const ShiftSchema = require('../models/shiftSchema.js');
const salary_schema = require('../models/salarySchema');
const leaveSchema = require('../models/leaveSchema.js');
const advance_schema = require('../models/advance_schema.js');
const employeeschemas = require('../models/employeeSchema.js');
const mongoose = require('mongoose'); // Import mongoose
const salarystru_master = require('../models/salarystruSchema');

const user_log = require('../models/user_log_Schema.js');
const moment = require('moment-timezone');
const XLSX = require('xlsx');

exports.GetSalary = async (req, res) => {
    try {
        console.log(req.body.endDate)
        var month = req.body.Month;
        let endDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
        let startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        startDate.setUTCHours(startDate.getUTCHours() + 5, startDate.getUTCMinutes() + 30, 0, 0);
        endDate.setUTCHours(endDate.getUTCHours() + 5, endDate.getUTCMinutes() + 30, 0, 0);
        
        startDate.setUTCHours(18, 30, 0, 0);
        startDate.setUTCHours(startDate.getUTCHours()); 
        endDate.setUTCHours(18, 29, 59, 999);
        
        endDate.setDate(endDate.getDate());
        startDate.setDate(startDate.getDate() -1 );

        const qry = { masterid: req.body.masterid,co_code: req.body.compid,div_code: req.body.divid, month, del: "N", dalatten_date: { $gte: startDate, $lt: endDate } };
        console.log(qry)
        // var month = req.body.month; // Define month appropriately based on your logic

        // req.body.month && (qry.month = month); // Add month condition if present
        // req.body.employee && (qry.employee_name = new mongoose.Types.ObjectId(req.body.employee));

        const summary = await dailyatten_mast.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'leaveSchema',
                    localField: 'dalatten_atdtype',
                    foreignField: '_id',
                    as: 'leaveSchema'
                }
            },
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
                    from: 'department_master_Schema',
                    localField: 'employeeschemas.department',
                    foreignField: '_id',
                    as: 'department_master_Schema'
                }
            },
            {
                $lookup: {
                    from: 'shiftSchema',
                    localField: 'dalatten_shiftnm',
                    foreignField: '_id',
                    as: 'shiftSchema'
                }
            },
            {
                $group: {
                    _id: {
                        lvid: "$leaveSchema._id",
                        lvname: "$leaveSchema.code",
                        day_count: "$leaveSchema.day_count",
                        empname: "$employeeschemas.full_name",
                        emp_id: "$employeeschemas._id",
                        gross_sal: "$employeeschemas.gross_sal",
                        shiftname: "$shiftSchema.shift_name",
                        deptname: "$department_master_Schema.description",
                    },
                    dalatten_overtimehrs: { $sum: "$dalatten_overtimehrs" },
                    dalatten_overtimemin: { $sum: "$dalatten_overtimemin" },
                    tot_hrs: { $sum: "$tot_hrs" },
                    dalatten_total_hour: { $sum: "$dalatten_total_hour" },
                    count: { $sum: 1 },
                    gross_sal: { $first: "$employeeschemas.gross_sal" },
                    machine_code: { $first: "$employeeschemas.machine_code" },
                }
            }
        ]);

        const summaryadv = await advance_schema.find({ month: month, del: "N" }).populate('employee_name', 'full_name')


        res.json({ success: true, summary, summaryadv });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.NewUpdateAdvance = async (req, res) => {
    try {
        const dataArray = req.body.data;
        await Promise.all(dataArray.map(async (data) => {
            const { _id, advance_amt, advance_remarks } = data;
            const existingData = await advance_schema.findById(_id);

            // Check if the database entry exists
            if (existingData) {
                existingData.advance_amt = advance_amt;

                existingData.advance_remarks = advance_remarks;

                // Update the database entry
                await existingData.save();
            }
        }));
        res.status(200).json({ status: true, message: 'Update Successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating data' });
    }
}

// exports.UpdateAdvance = async function (req, res) {
//     try {
//         console.log(req.body)
//         var advanceDateObject = moment(req.body.advance_date, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
//         let advancedatemilisecond = advanceDateObject.format('x');
        
//         console.log('122',req.body.advance_date,advancedatemilisecond)
//         if (req.body.advance_arry != undefined) {
//             req.body.advance_arry.forEach(async (advanceData) => {
//                 if (advanceData != undefined) {
//                     let advanceregister = new advance_schema();

//                     let advanceDateObject = moment(req.body.advance_date);
//                     // let advanceDateObject = moment(advance_date, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
//                     var monthnm = req.body.Month;
//                     advanceregister.month = monthnm;
//                     // advanceregister.monthnm = req.body.monthnm;
//                     advanceregister.advance_date = advanceDateObject;
//                     advanceregister.advance_datemilisecond = advancedatemilisecond;
            
//                     if (advanceData.employee_id != undefined) advanceregister.employee_name = advanceData.employee_id;
//                     // if (req.body.machine_code != undefined) advanceregister.machine_code = req.body.machine_code[i];
//                     if (advanceData.salary != undefined) advanceregister.salary = advanceData.salary;
//                     if (advanceData.advance_amt != undefined) advanceregister.advance_amt = advanceData.advance_amt;
//                     if (advanceData.advance_remarks != undefined) advanceregister.advance_remarks = advanceData.advance_remarks;
//                     // advanceregister.advance_arry = req.body.advance_arry;
//                     advanceregister.user = req.body.user;
//                     advanceregister.masterid = req.body.masterid;
//                     advanceregister.co_code = req.body.compid;
//                     advanceregister.div_code = req.body.divid;
//                     var advanceregister_entry = new Date();
//                     var entryDateObject = moment(advanceregister_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
//                     var entrydatemilisecond = entryDateObject.format('x');
//                     advanceregister.entry = entryDateObject;
//                     advanceregister.entry_datemilisecond = entrydatemilisecond;
//                     advanceregister.del = 'N';

//                     if (advanceData._id != undefined) var query = { _id: advanceData._id }
//                     else var query = { employee_name: advanceData.employee_id }

//                     var advanceregistermast = await advance_schema.findOne(query)

//                     if (advanceregistermast == null) {
//                         advanceregister.save()
//                         var userLog = new user_log;
//                         userLog.user_name = req.body.user;
//                         userLog.module_name = 'Advance Register';
//                         userLog.user_op = 'A';
//                         userLog.entry_id = advanceregister._id;
//                         var userLog_entry = new Date();
//                         var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
//                         var entrydatemilisecond = userDateObject.format('x');
//                         userLog.entry_date = userDateObject;
//                         userLog.entry_datemilisecond = entrydatemilisecond;
//                         userLog.save()
//                     } else {
//                         let advanceregister = {};
//                         // advanceregister.monthnm = req.body.monthnm;
//                         // advanceregister.radio_typ = req.body.radio_typ;
//                         // if (req.body.employee_name == '') req.body.employee_name[i] = mongoose.Types.ObjectId('578df3efb618f5141202a196');
//                         // if (req.body.advance_date != undefined) var advancedate = req.body.advance_date[i];
//                         advanceregister.advance_date = advanceDateObject;
//                         advanceregister.advance_datemilisecond = advancedatemilisecond;
//                         if (advanceData.employee_id != undefined) advanceregister.employee_name = advanceData.employee_id;
//                         // if (req.body.machine_code != undefined) advanceregister.machine_code = req.body.machine_code[i];
//                         if (advanceData.salary != undefined) advanceregister.salary = advanceData.salary;
//                         if (advanceData.advance_amt != undefined) advanceregister.advance_amt = advanceData.advance_amt;
//                         if (advanceData.advance_remarks != undefined) advanceregister.advance_remarks = advanceData.advance_remarks;
//                         advanceregister.user = req.body.user;
//                         advanceregister.masterid = req.body.masterid;
//                         advanceregister.co_code = req.body.compid;
//                         advanceregister.div_code = req.body.divid;
//                         var advanceregister_update = new Date();
//                         var updateDateObject = moment(advanceregister_update, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
//                         var updatedatemilisecond = updateDateObject.format('x');
//                         advanceregister.update = updateDateObject;
//                         advanceregister.update_datemilisecond = updatedatemilisecond;
//                         advanceregister.del = 'N';

//                         if (advanceData._id != undefined) var query = { _id: advanceData._id }
//                         await advance_schema.findOneAndUpdate(query, advanceregister);
//                                 var userLog = new user_log;
//                                 userLog.user_name = req.body.user;
//                                 userLog.module_name = 'Advance Register';
//                                 userLog.user_op = 'E';
//                                 userLog.entry_id = advanceData._id;
//                                 var userLog_entry = new Date();
//                                 var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
//                                 var entrydatemilisecond = userDateObject.format('x');
//                                 userLog.entry_date = userDateObject;
//                                 userLog.entry_datemilisecond = entrydatemilisecond;
//                                 userLog.save()
//                     }
//                 }
//             })
//         }
//         return res.json({ 'success': true, 'message': 'Data saved successfully' });
//     } catch (error) {
//         console.error('Error updating advance data:', error);
//         return res.status(500).json({ 'success': false, 'message': 'Error updating advance data', 'error': error });
//     }
// };

exports.UpdateAdvance = async function (req, res) {
    try {
        console.log(req.body);
        
        if (!req.body.advance_arry || req.body.advance_arry.length === 0) {
            return res.status(400).json({ 'success': false, 'message': 'No advance data provided' });
        }

        for (const advanceData of req.body.advance_arry) {
            if (!advanceData) {
                continue; // Skip undefined or null data
            }

            let advance_date = new Date(req.body.advance_date); // Parse the input date

            advance_date.setUTCHours(advance_date.getUTCHours() + 5);
            advance_date.setUTCMinutes(advance_date.getUTCMinutes() + 30);
            
            advance_date.setUTCHours(18, 30, 0, 0);
            
            let advanceDateObject = moment(advance_date).tz("Asia/Kolkata");
            advanceDateObject = advanceDateObject.subtract(1, 'days');
            let advancedatemilisecond = advanceDateObject.valueOf(); // Get milliseconds
            
            let advanceregister;
            let isNewAdvance = false;

            // Check if advance record already exists
            if (advanceData._id) {
                advanceregister = await advance_schema.findById(advanceData._id);
            } else {
                advanceregister = new advance_schema();
                isNewAdvance = true;
            }

            advanceregister.month = req.body.Month;
            advanceregister.advance_date = advanceDateObject;
            advanceregister.advance_datemilisecond = advancedatemilisecond;
            advanceregister.employee_name = advanceData.employee_id;
            advanceregister.salary = advanceData.salary;
            advanceregister.advance_amt = advanceData.advance_amt;
            advanceregister.advance_remarks = advanceData.advance_remarks;
            advanceregister.user = req.body.user;
            advanceregister.masterid = req.body.masterid;
            advanceregister.co_code = req.body.compid;
            advanceregister.div_code = req.body.divid;
            advanceregister.del = 'N';

            if (isNewAdvance) {
                await advanceregister.save();

                // Log user operation for new entry
                await logUserOperation('A', advanceregister._id, req.body.user);
            } else {
                await advanceregister.save();

                // Log user operation for update
                await logUserOperation('E', advanceregister._id, req.body.user);
            }
        }

        return res.json({ 'success': true, 'message': 'Data saved successfully' });
    } catch (error) {
        console.error('Error updating advance data:', error);
        return res.status(500).json({ 'success': false, 'message': 'Error updating advance data', 'error': error });
    }
};

async function logUserOperation(operation, entryId, userName) {
    const userLog = new user_log({
        user_name: userName,
        module_name: 'Advance Register',
        user_op: operation,
        entry_id: entryId,
        entry_date: moment().tz("Asia/Kolkata"),
        entry_datemilisecond: moment().valueOf()
    });
    await userLog.save();
}


exports.AdvanceList = async function (req, res) {
    try {
        var searchStr = req.query.search;
        var month = req.body.Month;
        let employeeStr = {};
        
        if (req.query.search) {
            var regex = new RegExp(req.query.search, "i")
            if (isNaN(Number(searchStr))) {
                employeeStr = {
                    $or: [
                        { 'full_name': regex },
                    ]
                };
                let employeemaster = await employee_master.find(employeeStr, { full_name: 1 });
                var employee_arr = employeemaster.map(employee => employee._id);
                
                searchStr = {
                    $or: [
                        { 'gross_salary': regex },
                        { 'total_attendance': regex },
                        { 'calculated_gross': regex },
                        { 'ot_hrs': regex },
                        { 'amt': regex },
                        { 'total_add': regex },
                        { 'total_less': regex },
                        { 'net_salary': regex },
                        { 'remark': regex },
                        { employee: { $in: employee_arr } },
                    ]
                };
            }
            else {
                searchStr = {
                    $or: [
                        { 'gross_salary': req.query.search },
                        { 'total_attendance': req.query.search },
                        { 'calculated_gross': req.query.search },
                        { 'ot_hrs': req.query.search },
                        { 'amt': req.query.search },
                        { 'total_add': req.query.search },
                        { 'total_less': req.query.search },
                        { 'net_salary': req.query.search },
                    ]
                };
            }
        }
        else {
            searchStr = {};
        }
        
        var qry = { month: month, co_code: req.body.compid, div_code: req.body.divid, main_bk: "SG", del: "N" };
        searchStr = Object.assign(searchStr, qry);
        
        var recordsTotal = await salary_schema.countDocuments({});
        var recordsFiltered = await salary_schema.countDocuments(searchStr);
        var limitValue = Number(req.query.length) >= 0 ? Number(req.query.length) : 0; // Ensure limit value is non-negative
        var skipValue = Number(req.query.start) >= 0 ? Number(req.query.start) : 0; // Ensure skip value is non-negative
        var results = await salary_schema.find(searchStr, "employee department gross_salary salryhd_or_group total_attendance calculated_gross ot_hrs amt total_add less_pf less_loan less_esic total_less less_advance less_tds net_salary remark ", { 'skip': skipValue, 'limit': limitValue })
            .populate('employee', "full_name").populate("salryhd_or_group.salaryhead_name", "salaryhead_name")
            .populate([{ path: 'employee', populate: { path: 'department' } }]);

            // employee_name:salaryschema.employee
        var atdqry  = { month: month,  co_code: req.body.compid, div_code: req.body.divid, del: "N" }
        
        var atdresults = await dailyatten_mast.find(atdqry,"dalatten_atdtype dalatten_date dalatten_intime dalatten_outtime dalatten_overtime tot_hrs Remarks dalatten_remarks dalatten_total_hour").populate('employee_name' , "full_name")
        .populate('dalatten_atdtype', 'discription').populate('dalatten_shiftnm','shift_name')
        // .populate([{ path: 'employee_name', populate: { path: 'default_shift' } }])
           
        console.log('atdqry',atdqry)
            
        var data = JSON.stringify({
            "draw": req.query.draw,
            "recordsFiltered": recordsFiltered,
            "recordsTotal": recordsTotal,
            "data": results,
            "atdresults":atdresults
        });
        
        res.send(data);
    } catch (error) {
        console.log('error while getting results' + error);
        res.status(500).send("Internal Server Error");
    }
}


exports.GivenAdvanceListGET = async (req, res) => {
    try {
        const qry = { masterid: req.body.masterid, co_code: req.body.compid, del: "N", month:req.body.month };
        const lastEntryNo = await advance_schema.aggregate([
            { $match: qry },
            {
                $lookup: {
                    from: 'employeeschemas',
                    localField: 'employee_name',
                    foreignField: '_id',
                    as: 'employeeschemas'
                }
            },
            { $sort: { advance_date: -1 } },
            { $project: {empname: { $arrayElemAt: ["$employeeschemas.full_name", 0] }, month: "$month", advance_date: "$advance_date", salary: "$salary", advance_amt: "$advance_amt" } }
        ]);
        const totalCount = lastEntryNo.length;
        res.json({status:true, totalCount, lastEntryNo });
    } catch (err) {
        console.error(err);
        res.status(500).json({status:false, error: err.message });
    }
};

exports.AdvanceDELETE = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        let state_mast = {
            delete: new Date(),
            del: 'Y'
        };

        await advance_schema.updateOne({ _id: req.params.id }, state_mast);

        var userLog = new user_log({
            user_name: req.params.user,
            module_name: 'advance_schema',
            user_op: 'D',
            entry_id: req.params.id,
            entry_date: new Date()
        });
        await userLog.save();

        res.json({ status: true });
    } catch (error) {
        console.error('Error deleting advance:', error);
        res.status(500).json({status:false, error: 'Internal server error' });
    }
};

exports.advance_import = async (req, res) => {
    try {
        var month = req.body.month;
        // var radio_typ = req.body.radio_typ
        if (req.file) {
            var step = [];
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            var dictionary = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            for (const [key, value] of Object.entries(dictionary)) {
                step.push(value);
            }
            // var docs = [];
            for (s = 0; s < step.length; s++) {

                if (step[s] != undefined && step[s]['Date'] != undefined) var dalatten_date = step[s]['Date'];
                // if (step[s] != undefined && step[s]['Machine Code'] != undefined) var machine_code = step[s]['Machine Code'];
                // else machine_code = "";

                var employee_name_id = new mongoose.Types.ObjectId('578df3efb618f5141202a196');

                if (step[s] != undefined && step[s]['Machine Code'] != undefined) {
                    var employee_machine_code = await employee_master.findOne({ machine_code: step[s]['Machine Code'].toString().trim(), masterid: req.body.masterid, del: "N" });
                    if (employee_machine_code != null && employee_machine_code != undefined) employee_name_id = employee_machine_code._id;
                }
                else {
                    if (step[s] != undefined && step[s]['Employee Name'] != undefined) {
                        var employee_name = await employee_master.findOne({ full_name: step[s]['Employee Name'].toString().trim(), masterid: req.body.masterid, del: "N" });
                        if (employee_name != null) employee_name_id = employee_name._id;
                    }
                }

                if (step[s] != undefined && step[s]['Amount'] != undefined) var amount = step[s]['Amount'];
                else var amount = "";

                var advancemast = await advance_schema.find({ employee_name: employee_name_id })
                if (advancemast != null) {

                    var importadvanceregister = new advance_schema();
                    importadvanceregister.month = month;
                    // importadvanceregister.radio_typ = radio_typ;
                    if (dalatten_date != undefined) {
                        var DateObject = moment(dalatten_date, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var datemilisecond = DateObject.format('x');
                        let dalattenDateObject = moment(dalatten_date, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
                        var month = dalattenDateObject.format('M');
                    }
                    monthnm = "";
                    // var month =DateObject.format('M');
                    if (month == 1) monthnm = "January"
                    if (month == 2) monthnm = "February"
                    if (month == 3) monthnm = "March"
                    if (month == 4) monthnm = "April"
                    if (month == 5) monthnm = "May"
                    if (month == 6) monthnm = "June"
                    if (month == 7) monthnm = "July"
                    if (month == 8) monthnm = "August"
                    if (month == 9) monthnm = "September"
                    if (month == 10) monthnm = "October"
                    if (month == 11) monthnm = "November"
                    if (month == 12) monthnm = "December"

                    importadvanceregister.dalatten_date = dalatten_date
                    importadvanceregister.month = monthnm;
                    importadvanceregister.advance_date = DateObject;
                    importadvanceregister.advance_datemilisecond = datemilisecond;
                    importadvanceregister.advance_amt = amount;
                    importadvanceregister.employee_name = employee_name_id;
                    importadvanceregister.entry = new Date();
                    importadvanceregister.del = "N";
                    importadvanceregister.user = req.body.user;
                    importadvanceregister.masterid = req.body.masterid;
                    importadvanceregister.co_code = req.body.compid;
                    importadvanceregister.div_code = req.body.divid;
                    importadvanceregister.save();
                    // var userLog = new user_log;
                    // userLog.user_name = req.cookies.user;
                    // userLog.module_name = 'Advance Register Import';
                    // userLog.user_op = 'Import Add';
                    // userLog.entry_id = importadvanceregister._id;
                    // var userLog_entry = new Date();
                    // var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                    // var entrydatemilisecond = userDateObject.format('x');
                    // userLog.entry_date = userDateObject;
                    // userLog.entry_datemilisecond = entrydatemilisecond;
                    // userLog.save()
                }
            }
        }
        return res.json({ status: true, message: "Import Successful" })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}