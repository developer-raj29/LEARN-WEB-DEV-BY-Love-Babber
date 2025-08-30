const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB
const { validationResult } = require('express-validator');

const Company = require('../models/company.model.js');
const DivSchema = require('../models/divSchema.js');

exports.companyByUser=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({status:false, errors: errors.array() });
    }
    const {co_code}=req.body
    try {
        const co_codeObjectIds = co_code.map(id => new ObjectId(id));

        const company = await Company.find({ _id: { $in: co_codeObjectIds } });
        if (!company) {
            return res.status(404).json({ message: 'companies not found'});
        }
        return res.status(200).json({status:true,company});

    } catch (error) {
        return res.status(500).json({status:false,error:error.message})
    }
}

exports.ComDivision=async(req,res)=>{
    const {div_code}=req.body
    try {
        const div_codeObjectIds = div_code.map(id => new ObjectId(id));

        const division = await DivSchema.find({ _id: { $in: div_codeObjectIds } });
        console.log(division)

        if (!division) {
            return res.status(404).json({status:false, message: 'Division not found'});
        }

        return res.status(200).json({status:true,division});

    } catch (error) {
        return res.status(500).json({status:false,error:error.message})
    }
}