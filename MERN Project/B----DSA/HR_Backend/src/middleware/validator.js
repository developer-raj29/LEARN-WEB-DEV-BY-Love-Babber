const { body,query,param,validationResult } = require('express-validator');

module.exports.validateemployeegrade_masterAdd = [
    body('discription').notEmpty().withMessage('Description is required'),
    body('code').notEmpty().withMessage('Code is required'),
]

module.exports.companyByUserValidator = [
  body('co_code').isArray().withMessage('co_code must be an array'),
];

module.exports.ComDivisionValidator = [
  body('div_code').isArray().withMessage('div_code must be an array'),
];