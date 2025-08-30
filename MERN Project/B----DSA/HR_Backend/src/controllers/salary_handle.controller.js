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

exports.Salary_List = async function (req, res) {
    try {
        console.log("-----", req.query.search)
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
                        { 'remark': regex },
                        { employee: { $in: employee_arr } },
                    ]
                };
            }
            else {
                searchStr = {
                    $or: [
                        { 'gross_salary': parseFloat(req.query.search) },
                        { 'total_attendance': parseFloat(req.query.search) },
                        { 'calculated_gross': parseFloat(req.query.search) },
                        { 'ot_hrs': parseFloat(req.query.search) },
                        { 'amt': parseFloat(req.query.search) },
                        { 'total_add': parseFloat(req.query.search) },
                        { 'total_less': parseFloat(req.query.search) },
                        { 'net_salary': parseFloat(req.query.search) },
                    ]
                };
            }
        }
        else {
            searchStr = {};
        }

        var qry = { month: month, co_code: req.body.compid, div_code: req.body.divid, main_bk: "SG", del: "N" };
        searchStr = Object.assign(searchStr, qry);

        console.log('63', searchStr, regex, isNaN(Number(searchStr)))


        var recordsTotal = await salary_schema.countDocuments({});
        var recordsFiltered = await salary_schema.countDocuments(searchStr);
        var limitValue = Number(req.query.length) >= 0 ? Number(req.query.length) : 0; // Ensure limit value is non-negative
        var skipValue = Number(req.query.start) >= 0 ? Number(req.query.start) : 0; // Ensure skip value is non-negative
        var results = await salary_schema.find(searchStr, "employee department gross_salary salryhd_or_group total_attendance calculated_gross ot_hrs amt total_add less_pf less_loan less_esic total_less less_advance less_tds net_salary remark ", { 'skip': skipValue, 'limit': limitValue })
            .populate('employee', "full_name").populate("salryhd_or_group.salaryhead_name", "salaryhead_name")
            .populate([{ path: 'employee', populate: { path: 'department' } }])
            .populate([{ path: 'employee', populate: { path: 'default_shift' } }]);

        // employee_name:salaryschema.employee
        var atdqry = { month: month, co_code: req.body.compid, div_code: req.body.divid, del: "N" }

        var atdresults = await dailyatten_mast.find(atdqry, "dalatten_atdtype dalatten_date dalatten_intime dalatten_outtime dalatten_overtime tot_hrs Remarks dalatten_remarks dalatten_total_hour").populate('employee_name', "full_name")
            .populate('dalatten_atdtype', 'discription').populate('dalatten_shiftnm', 'shift_name')
        // .populate([{ path: 'employee_name', populate: { path: 'default_shift' } }])

        console.log('atdqry', atdqry)

        var data = JSON.stringify({
            "draw": req.query.draw,
            "recordsFiltered": recordsFiltered,
            "recordsTotal": recordsTotal,
            "data": results,
            "atdresults": atdresults
        });

        res.send(data);
    } catch (error) {
        console.log('error while getting results' + error);
        res.status(500).send("Internal Server Error");
    }
}

exports.DeleteSalary = async function (req, res) {
    try {
        var month = req.body.Month;
        let salarygenration = {};
        var salarygenration_delete = new Date();
        var DateObject = moment(salarygenration_delete, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
        var deletedatemilisecond = DateObject.format('x');
        salarygenration.delete = DateObject;
        salarygenration.delete_datemilisecond = deletedatemilisecond;
        salarygenration.del = 'Y';

        await salary_schema.updateMany(
            { masterid: req.body.masterid, co_code: req.body.compid, div_code: req.body.divid, month: month },
            salarygenration
        );

        res.status(200).json({ status: true, message: `${month} Salaries Deleted Successfully.` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Oops... an error occured.' });
    }
}
exports.GenerateSalary = async function (req, res) {
    try {
        var month = req.body.Month;
        var qry = { masterid: req.body.masterid, del: "N", co_code: req.body.compid, div_code: req.body.divid }
        var lvqry = { masterid: req.body.masterid, del: "N" }

        // qry = Object.assign(qry, { _id: new mongoose.Types.ObjectId("66489f679151e1d8e74b372c") })

        console.log(qry)

        var employeemasterfind = await employee_master.find(qry)
            .populate("salryhd_or_group.salaryhead_name").populate('default_shift')


        console.log(employeemasterfind.length)
        for (var i = 0; i < employeemasterfind.length; i++) {
            if (employeemasterfind[i] != undefined) {
                var totadd = 0;
                var totless = 0;
                var advamt = 0
                var pfamt = 0
                var ptamt = 0
                var esicamt = 0
                var loanamt = 0
                var leave_arr = [];
                prsntdys = 0;
                othrs = 0;
                var otamt = 0;
                var basicamt = 0;
                var sund = -1;// await sundays(2023,12)

                var employee = employeemasterfind[i]._id;
                var gross_salary = employeemasterfind[i].gross_sal;
                var qry = { masterid: req.body.masterid, del: "N" };

                if (month != '') {
                    qry = Object.assign(qry, { month: month })
                    lvqry = Object.assign(lvqry, { month: month })
                }
                if (employee != '') {
                    qry = Object.assign(qry, { employee_name: new mongoose.Types.ObjectId(employee) })
                    lvqry = Object.assign(lvqry, { employee_name: new mongoose.Types.ObjectId(employee) })
                }

                var days = 26
                if (employeemasterfind[i].days != undefined && employeemasterfind[i].days == "30") days = 30
                else if (employeemasterfind[i].days != undefined && employeemasterfind[i].days == "N") days = getDaysInMonth(month, req.body.compsdate, req.body.compedate);
                else var days = 26

                if (employeemasterfind[i].loangroup != undefined && employeemasterfind[i].loangroup[0] != undefined && parseFloat(employeemasterfind[i].loangroup[0].loaninstallment) > 0) loanamt = parseFloat(employeemasterfind[i].loangroup[0].loaninstallment)

                leave_arr = await getleavearray(lvqry);
                advamt = await getadvance(lvqry);

                console.log('othrs 175', othrs)
                var workhrs = 8
                if (employeemasterfind[i].default_shift != null) workhrs = parseFloat(employeemasterfind[i].default_shift.total_hour);
                //if (employeemasterfind[i].ol_appl=="N")  othrs = 0;/// remove because from attendace it is controlled.

                otamt = parseFloat((parseFloat(gross_salary) / days / workhrs) * othrs).toFixed(0); //otamt
                if (employeemasterfind[i].ol_appl == "1.5") otamt = parseFloat(parseFloat(otamt) * 1.5);

                if (leave_arr.length >= 0) {
                    console.log(leave_arr, '465', prsntdys)
                    var arryidx = await arrayexists(leave_arr, 'leave_name', '646391fad4b7b3d45c9c8a9d');
                    console.log('525', leave_arr.length, arryidx)
                    if (arryidx >= 0) prsntdys = leave_arr[arryidx].nos

                    var aryidx = -1
                    aryidx = await arrayexists(leave_arr, 'leave_name', '650809b30b45a44dfce3a3ca'); //week of
                    console.log('531', leave_arr.length, aryidx)
                    if (aryidx >= 0) sund = leave_arr[aryidx].nos
                }
                if ((parseInt(sund) > 4)) sund = 4;
                console.log('sunday', sund, employeemasterfind[i].ol_appl, otamt)
                if (parseInt(sund) > 0 && employeemasterfind[i].weekly_leave != "NA") {
                    // var arr1 = {
                    //     leave_name: mongoose.Types.ObjectId("650809b30b45a44dfce3a3ca"),
                    //     nos: sund,
                    //     hrs: 0,
                    // }
                    // leave_arr.push(arr1);
                    prsntdys = parseInt(prsntdys) + parseInt(sund)
                }
                console.log('545', prsntdys, sund, employeemasterfind[i].full_name)

                var salryhd_arr = [];
                if (parseFloat(parseFloat(prsntdys)) > 0 && employeemasterfind[i].salryhd_or_group != undefined) {
                    for (var k = 0; k < employeemasterfind[i].salryhd_or_group.length; k++) {
                        if (employeemasterfind[i].salryhd_or_group[k] != undefined) {

                            var salaryheadname = employeemasterfind[i].salryhd_or_group[k].salaryhead_name._id;
                            var salryhdsign = employeemasterfind[i].salryhd_or_group[k].salryhd_sign;
                            var salryhdcalcb = employeemasterfind[i].salryhd_or_group[k].salaryhead_name.calculation_basis;
                            // console.log('salryhdcalcb',salryhdcalcb)
                            var salryhdround = employeemasterfind[i].salryhd_or_group[k].salryhd_round;
                            var amount = employeemasterfind[i].salryhd_or_group[k].amount;
                            if (employeemasterfind[i].salryhd_or_group[k].amount == "" || employeemasterfind[i].salryhd_or_group[k].amount == undefined) amount = employeemasterfind[i].salryhd_or_group[k].salryhd_vlu

                            var calculated_gross = parseFloat(gross_salary) / days * parseFloat(prsntdys);
                            if (isNaN(calculated_gross)) calculated_gross = 0;

                            var amt = parseFloat(parseFloat(amount) / parseFloat(days) * parseFloat(prsntdys)).toFixed(0);
                            if (isNaN(amt)) amt = 0;
                            var salryhdodr = employeemasterfind[i].salryhd_or_group[k].salryhd_odr;
                            var salryhdvlu = employeemasterfind[i].salryhd_or_group[k].salryhd_vlu;
                            var vluamt = 0;

                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name.toString().trim() == "ESIC") vluamt = parseFloat((parseFloat(calculated_gross) + parseFloat(otamt)) * parseFloat(salryhdvlu) / 100).toFixed(0);
                            else if (salryhdcalcb == "Fix Amount") vluamt = parseFloat(parseFloat(salryhdvlu) / parseFloat(days) * parseFloat(prsntdys)).toFixed(0);
                            else if (salryhdcalcb == "% of Gross") vluamt = parseFloat(parseFloat(calculated_gross) * parseFloat(salryhdvlu) / 100).toFixed(0);
                            else if (salryhdcalcb == "% of Basic") vluamt = parseFloat(parseFloat(basicamt) * parseFloat(salryhdvlu) / 100).toFixed(0);

                            if (isNaN(vluamt)) vluamt = 0;
                            if (isNaN(otamt)) otamt = 0;


                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "PT" || employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "Professional Tax") vluamt = amount
                            console.log('553', employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name, vluamt, amount, calculated_gross, otamt)

                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "PF" && employeemasterfind[i].pf_application == "N") vluamt = 0

                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "ESIC" && employeemasterfind[i].esi_applicable == "N") vluamt = 0
                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "ESIC" && parseFloat(employeemasterfind[i].gross_sal) > parseFloat(employeemasterfind[i].salryhd_or_group[k].salaryhead_name.max_limit)) vluamt = 0
                            if ((employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "PT" || employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "Professional Tax") && employeemasterfind[i].machine == "N") vluamt = 0


                            // console.log('518',i,k,vluamt ,salryhdvlu,days,employeemasterfind[i].salryhd_or_group[k].salryhd_calcb,prsntdys,employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name.toString().trim().toUpperCase(),)

                            if (isNaN(vluamt)) vluamt = 0;

                            if (salryhdsign == "(+)") totadd = parseFloat(totadd) + parseFloat(vluamt);
                            else totless = parseFloat(totless) + parseFloat(vluamt);
                            if (isNaN(totadd)) totadd = 0;


                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name.toString().trim().toUpperCase() == "BASIC") basicamt = vluamt;

                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "PF") pfamt = vluamt;
                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "ESIC") esicamt = vluamt;
                            if (employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "PT" || employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name == "Professional Tax") ptamt = vluamt;

                            var arr2 = {
                                salaryhead_name: salaryheadname,
                                salryhd_sign: salryhdsign,
                                salryhd_calcb: salryhdcalcb,
                                salryhd_round: salryhdround,
                                amount: vluamt,
                                salryhd_odr: salryhdodr,
                                salryhd_vlu: salryhdvlu
                            }
                            // console.log('536',arr2,basicamt,employeemasterfind[i].salryhd_or_group[k].salaryhead_name.salaryhead_name.toString().trim().toUpperCase())
                            salryhd_arr.push(arr2);
                        }

                        if (k == employeemasterfind[i].salryhd_or_group.length - 1) {
                            console.log('446', prsntdys, sund, employeemasterfind[i].salryhd_or_group.length, employeemasterfind[i].full_name, employeemasterfind[i].gross_sal)
                            if (parseFloat(parseFloat(prsntdys) - parseFloat(sund)) > 0 && employeemasterfind[i].salryhd_or_group.length > 0) {
                                var salary_genration = new salary_schema();
                                salary_genration.main_bk = "SG";
                                salary_genration.month = month;
                                salary_genration.employee = employee;
                                salary_genration.gross_salary = gross_salary;

                                salary_genration.salryhd_or_group = salryhd_arr;
                                salary_genration.total_attendance = prsntdys;
                                salary_genration.leave_or_group = leave_arr;

                                salary_genration.calculated_gross = calculated_gross.toFixed(0);
                                salary_genration.ot_hrs = othrs;

                                salary_genration.amt = otamt

                                console.log(workhrs, salary_genration.amt, days, gross_salary, workhrs)

                                salary_genration.total_add = parseFloat(parseFloat(totadd).toFixed(2));
                                salary_genration.less_advance = advamt;
                                salary_genration.less_pf = pfamt;
                                salary_genration.less_loan = loanamt;
                                salary_genration.less_esic = esicamt;
                                salary_genration.less_pt = ptamt;

                                if (isNaN(totless)) totless = 0;
                                salary_genration.total_less = parseFloat(parseFloat(totless).toFixed(2));
                                salary_genration.net_salary = parseFloat((parseFloat(salary_genration.amt) + parseFloat(totadd) - parseFloat(totless) - parseFloat(loanamt) - parseFloat(advamt)).toFixed(0))
                                salary_genration.user = req.body.user;
                                salary_genration.masterid = req.body.masterid;
                                salary_genration.co_code = req.body.compid;
                                salary_genration.div_code = req.body.divid;
                                var salary_genration_entry = new Date();
                                var entryDateObject = moment(salary_genration_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                                var entrydatemilisecond = entryDateObject.format('x');
                                salary_genration.entry = entryDateObject;
                                salary_genration.entry_datemilisecond = entrydatemilisecond;
                                salary_genration.del = 'N';
                                var empqry = { employee: employee, del: "N", co_code: req.body.compid, div_code: req.body.divid, month: month }
                                await salary_schema.findOne(empqry).then(async (salary_schema) => {
                                    console.log('empqry', empqry, salary_schema)

                                    if (salary_schema == null) {
                                        await salary_genration.save().then(async (errors, salary_schema) => {


                                            if (loanamt > 0) {
                                                const Empdata = await employeeschemas.findById(employee);

                                                const loanGroup = Empdata.loangroup || [];
                                                loanGroup.push({
                                                    "loan_date": entryDateObject,
                                                    "loan_datemilisecond": entrydatemilisecond,
                                                    "loanremarks": "Deducted on" + month,
                                                    "loandc": "(+)",
                                                    "loanamount": 0,
                                                    "loaninstallment": loanamt,
                                                });
                                                await employeeschemas.updateOne(qry, { $set: { loangroup: loanGroup } });
                                            }
                                            console.log('err', errors)
                                            // var userLog = new user_log;
                                            // userLog.user_name = req.body.user;
                                            // userLog.module_name = 'Salary Generation';
                                            // userLog.user_op = 'A';
                                            // userLog.entry_id = salary_genration._id;
                                            // var userLog_entry = new Date();
                                            // var userDateObject = moment(userLog_entry, "YYYY-MM-DD hh:mm a").tz("Asia/Kolkata");
                                            // var entrydatemilisecond = userDateObject.format('x');
                                            // userLog.entry_date = userDateObject;
                                            // userLog.entry_datemilisecond = entrydatemilisecond;
                                            // userLog.save()
                                        });
                                    }
                                });
                            }
                        }
                    }
                }

            }
            if (i == employeemasterfind.length - 1) {
                res.status(200).json({ status: true });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Oops... an error occured.', error: error.message });
    }

}

var getDaysInMonth = function (monthnm, sdate, edate) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    var syear = sdate.toString().substr(0, 4);
    var eyear = edate.toString().substr(0, 4);


    if (parseInt(month) < 4) year = syear
    else year = eyear

    var month = 0;
    if (monthnm == "January") month = 1
    if (monthnm == "February") month = 2
    if (monthnm == "March") month = 3
    if (monthnm == "April") month = 4
    if (monthnm == "May") month = 5
    if (monthnm == "June") month = 6
    if (monthnm == "July") month = 7
    if (monthnm == "August") month = 8
    if (monthnm == "September") month = 9
    if (monthnm == "October") month = 10
    if (monthnm == "November") month = 11
    if (monthnm == "December") month = 12

    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};

function sundays(y, m) {
    return new Promise(function (fullfill) {

        var days = new Date(y, m, 0).getDate();
        var sundays = [8 - (new Date(m + '/01/' + y).getDay())];
        for (var i = sundays[0] + 7; i < days; i += 7) {
            sundays.push(i);
        }
        // console.log('305',sundays.length)
        fullfill(sundays.length);
    })
}

var prsntdys = 0;
var othrs = 0;

function arrayexists(reparray, compr, comppnm) {
    var index = -1
    if (reparray.length > 0) {
        for (var i = 0; i < reparray.length; i++) {
            if (reparray[i] != undefined && reparray[i][compr].toString().trim() == comppnm) {
                index = i;
                break;
            }
        }
    }
    return index;
}

function getadvance(qry) {
    return new Promise(async function (resolve, reject) {
        try {
            var amt = 0;
            var lastEntryNo = await advance_schema.aggregate([
                { $match: qry },
                {
                    $group:
                    {
                        _id: {
                            "empid": "$employee_name",
                        },
                        amt: { $sum: { $convert: { input: "$advance_amt", to: "decimal", onError: 0 } } },
                        count: { $sum: 1 }
                    },
                }
            ]).exec();

            if (lastEntryNo.length > 0 && lastEntryNo[0].amt != undefined) {
                amt = lastEntryNo[0].amt;
            }
            resolve(amt);
        } catch (error) {
            reject(error);
        }
    });
}

function getleavearray(qry) {
    return new Promise(async function (resolve, reject) {
        try {
            var leave_arr = [];
            // console.log('346',qry)

            var lastEntryNo = await dailyatten_mast.aggregate([
                { $match: qry },
                {
                    $lookup: {
                        'from': 'leaveSchema',
                        'localField': 'dalatten_atdtype',
                        'foreignField': '_id',
                        'as': 'leaveSchema'
                    }
                },
                {
                    $unwind: {
                        path: "$leaveSchema",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group:
                    {
                        _id: {
                            "lvid": "$leaveSchema._id",
                            "lvname": "$leaveSchema.discription",
                            "day_count": "$leaveSchema.day_count",

                        },
                        tot_hrs: { $sum: "$tot_hrs" },
                        ot_hrs: { $sum: { $convert: { input: "$dalatten_overtime", to: "int", onError: 0 } } },
                        ot_hr: { $sum: { $convert: { input: "$dalatten_overtimehrs", to: "int", onError: 0 } } },
                        ot_mins: { $sum: { $convert: { input: "$dalatten_overtimemin", to: "double", onError: 0 } } },
                        count: { $sum: 1 }
                    },
                },
                { $sort: { dalatten_atdtype: 1 } }
            ]).exec();

            if (lastEntryNo.length > 0) {
                othrs = 0;
                for (var j = 0; j < lastEntryNo.length; j++) {

                    console.log(j,lastEntryNo[j].ot_hrs)
                    var ot_mins =0
                    var day_count = 1;
                    if (lastEntryNo[j] != undefined && lastEntryNo[j]._id != undefined) var lvid = lastEntryNo[j]._id.lvid;
                    else lvid = new mongoose.Types.ObjectId('578df3efb618f5141202a196');
                    if (lastEntryNo[j] != undefined && lastEntryNo[j]._id != undefined) var lvname = lastEntryNo[j]._id.lvname;
                    if (lastEntryNo[j] != undefined && lastEntryNo[j]._id != undefined) var day_count = lastEntryNo[j]._id.day_count;

                    var tot_hrs = lastEntryNo[j].tot_hrs;
                    if (lvname != "Absent") othrs = parseFloat(othrs) + lastEntryNo[j].ot_hrs;
                    if (parseFloat(lastEntryNo[j].ot_mins) != 0 && lvname != "Absent") {
                        ot_mins = parseFloat(lastEntryNo[j].ot_mins) / 60;
                        othrs = parseFloat(othrs) + parseFloat(ot_mins);
                    }
                    var count = parseFloat(lastEntryNo[j].count) * parseFloat(day_count);
                    if (lvname == "Second Shift") {
                        othrs = parseFloat(othrs) + parseFloat(lastEntryNo[j].tot_hrs);
                    }
                    if (lvname == "Present" || lvname == "Paid Holiday") {
                        prsntdys = parseInt(prsntdys) + parseInt(count);
                        othrs = othrs;
                    }
                    console.log(lvname, othrs, ot_mins, lastEntryNo[j].ot_hrs)
                    var arr1 = {
                        leave_name: lvid,
                        nos: count,
                        day_count: day_count,
                        hrs: tot_hrs,
                        othrs: othrs
                    };
                    leave_arr.push(arr1);
                }
            }
            console.log('leave_arr',leave_arr)
            resolve(leave_arr);
        } catch (error) {
            reject(error);
        }
    });
}

