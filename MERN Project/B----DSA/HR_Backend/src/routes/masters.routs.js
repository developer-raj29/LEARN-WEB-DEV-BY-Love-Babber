const express = require("express");

const router = express.Router();
const authenticate = require("../middleware/authenticat.js")

const masters = require("../controllers/masters.controller.js")
const { validateemployeegrade_masterAdd } = require("../middleware/validator.js")

const multer = require("multer")
const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
        cb(null, file.originalname);
    }
});
const uploada = multer({ storage: storage });

// Comapany Master
router.post('/CompanyTypeGET', masters.CompanyTypeGET);

// Group Master
router.post('/GroupMaster_Add', masters.GroupMaster_Add);
router.get('/GroupMasterGET', masters.GroupMasterGET);
router.get('/GroupMasterTypesGET', masters.GroupMasterTypesGET);
router.post('/GroupMasterDELETE/:id', masters.GroupMasterDELETE);
router.get('/GroupMasterTypesWithIDGET', masters.GroupMasterTypesWithIDGET);

// State Master
router.post('/StateMaster_Add', masters.StateMaster_Add);
router.get('/StateMasterGET', masters.StateMasterGET);
router.post('/StateMasterDELETE/:id', masters.StateMasterDELETE);
router.post('/StateTypeGET', masters.StateTypeGET);

// City Master
router.post('/CityMaster_Add', masters.CityMaster_Add);
router.get('/CityMasterGET', masters.CityMasterGET);
router.post('/CityMasterDELETE/:id', masters.CityMasterDELETE);
router.post('/CityTypeGET', masters.CityTypeGET);

// Maintenance Master
router.post('/MaintenanceMaster_Add', masters.MaintenanceMaster_Add);
router.get('/MaintenanceMasterGET', masters.MaintenanceMasterGET);
router.post('/MaintenanceMasterDELETE/:id', masters.MaintenanceMasterDELETE);

// Make Master
router.post('/MakeMaster_Add', masters.MakeMaster_Add);
router.get('/MakeMasterGET', masters.MakeMasterGET);
router.post('/MakeMasterDELETE/:id', masters.MakeMasterDELETE);
router.post('/MakeTypeGET', masters.MakeTypeGET);

// Variant Master
router.post('/VariantMaster_Add', masters.VariantMaster_Add);
router.get('/VariantMasterGET', masters.VariantMasterGET);
router.post('/VariantMasterDELETE/:id', masters.VariantMasterDELETE);
router.post('/VariantTypeGET', masters.VariantTypeGET);

// Model Master
router.post('/ModelMaster_Add', masters.ModelMaster_Add);
router.get('/ModelMasterGET', masters.ModelMasterGET);
router.post('/ModelMasterDELETE/:id', masters.ModelMasterDELETE);
router.post('/ModelypeGET', masters.ModelypeGET);

// Fuel Master
router.post('/FuelMaster_Add', masters.FuelMaster_Add);
router.get('/FuelMasterGET', masters.FuelMasterGET);
router.post('/FuelMasterDELETE/:id', masters.FuelMasterDELETE);

// Document Master
router.post('/DocumentMaster_Add', masters.DocumentMaster_Add);
router.get('/DocumentMasterGET', masters.DocumentMasterGET);
router.post('/DocumentMasterDELETE/:id', masters.DocumentMasterDELETE);
router.post('/DoctypeGET', masters.DoctypeGET);

// Customer Category Master
router.post('/CustomerCategoryMaster_Add', masters.CustomerCategoryMaster_Add);
router.get('/CustomerCategoryMasterGET', masters.CustomerCategoryMasterGET);
router.post('/CustomerCategoryMasterDELETE/:id', masters.CustomerCategoryMasterDELETE);
router.post('/CustomerCategoryTypeGET', masters.CustomerCategoryTypeGET);

// Customer Type Master
router.post('/CustomerTypeMaster_Add', masters.CustomerTypeMaster_Add);
router.get('/CustomerTypeMasterGET', masters.CustomerTypeMasterGET);
router.post('/CustomerTypeMasterDELETE/:id', masters.CustomerTypeMasterDELETE);
router.post('/CustomerTypeOptionsGET', masters.CustomerTypeOptionsGET);

// Bank Master
router.post('/BankMaster_Add', masters.BankMaster_Add);
router.get('/BankMasterGET', masters.BankMasterGET);
router.post('/BankMasterDELETE/:id', masters.BankMasterDELETE);
router.post('/BankTypeGET', masters.BankTypeGET);

// Account Master
router.post('/AccountMaster_Add', masters.AccountMaster_Add);
router.get('/AccountMasterGET', masters.AccountMasterGET);
router.get('/AccountSetupAccountsGET', masters.AccountSetupAccountsGET);
router.post('/AccountMasterDELETE/:id', masters.AccountMasterDELETE);

// Group Setup
router.post('/GroupSetupNames_Add', masters.GroupSetupNames_Add);
router.get('/GroupSetupTypesWithIDGET', masters.GroupSetupTypesWithIDGET);
router.post('/GroupSetup_Add', masters.GroupSetup_Add);
router.get('/GroupSetupGET', masters.GroupSetupGET);
router.post('/PayoutAccountGET', masters.PayoutAccountGET);
router.post('/LimitAccountGET', masters.LimitAccountGET);
router.post('/Limit_Bank_CashGroupGET', masters.Limit_Bank_CashGroupGET);
router.post('/CustomerGroupGET', masters.CustomerGroupGET);
router.post('/ExecutiveGroupGET', masters.ExecutiveGroupGET);
router.post('/SubExecutiveGroupGET', masters.SubExecutiveGroupGET);
router.post('/DealerGroupGET', masters.DealerGroupGET);
router.post('/AgentGroupGET', masters.AgentGroupGET);
router.post('/SubDealerGroupGET', masters.SubDealerGroupGET);
router.post('/LoanCreditAcGroupGET', masters.LoanCreditAcGroupGET);
router.post('/Bank_CashGroupGET', masters.Bank_CashGroupGET);


// Customer Master

router.get('/AccountMasterFileDownload', masters.AccountMasterFileDownload);
router.post('/CustomerMaster_Add', masters.CustomerMaster_Add);
router.get('/CustomerMasterGET', masters.CustomerMasterGET);
router.post('/CustomerMasterDELETE/:id', masters.CustomerMasterDELETE);

router.post('/GuranterGET', masters.GuranterGET);

// Customer Application
router.post('/MaxApplicationNo', masters.MaxApplicationNo);
router.get('/CustomerApplicationFileDownload', masters.CustomerApplicationFileDownload);
router.get('/CustomerRegistrationFileDownload', masters.CustomerRegistrationFileDownload);
router.post('/CustomerApplication_Add', masters.CustomerApplication_Add);
router.post('/CustomerApplication_Update', masters.CustomerApplication_Update);
router.get('/CustomerApplicationGET', masters.CustomerApplicationGET);
router.get('/CustomerApplicationsListGET', masters.CustomerApplicationsListGET);
router.get('/CustomerApplicationGET2', masters.CustomerApplicationGET2);

router.post('/CustomerApplicationDocumentsUpdate', uploada.array('files'), masters.CustomerApplicationDocumentsUpdate);
router.post('/CustomerApplicationDocumentsGet', masters.CustomerApplicationDocumentsGet);

// Stages
router.post('/Stage_Update', masters.Stage_Update);
router.post('/PostAgent', masters.PostAgent);
router.get('/StagesGET', masters.StagesGET);
router.post('/narationGet', masters.narationGet);
router.post('/PaymentUpdate', masters.PaymentUpdate);
router.post('/PaymentGet', masters.PaymentGet);
router.get('/DisbursedTransGET', masters.DisbursedTransGET);
router.post('/CancelLoginApplications', masters.CancelLoginApplications);

// Account Setup
router.post('/AccountSetupNames_Add', masters.AccountSetupNames_Add);
router.get('/AccountSetupTypesWithIDGET', masters.AccountSetupTypesWithIDGET);
router.post('/AccountSetup_Add', masters.AccountSetup_Add);
router.get('/AccountSetupGET', masters.AccountSetupGET);

// accounting reports
router.post('/LedgerreportGET', masters.LedgerreportGET);
router.post('/Bank_CashReportGroupsGET', masters.Bank_CashReportGroupsGET);
router.post('/CashBankreportGET', masters.CashBankreportGET);
router.get('/ReportAccountsGET', masters.ReportAccountsGET);
router.post('/ledgerReportGroupsGET', masters.ledgerReportGroupsGET);
router.post('/TraileportGET', masters.TraileportGET);

router.get('/BankLimitGET', masters.BankLimitGET);
// router.post('/bankLimit_Update', masters.bankLimit_Update);
router.post('/bankLimit_Update', uploada.array('files'), masters.bankLimit_Update);
router.get('/BankLimitDetailsGET', masters.BankLimitDetailsGET);
router.get('/DealerReportGET', masters.DealerReportGET);

// Inquiry
router.post('/Inquiry_Add', masters.Inquiry_Add);
router.post('/Customer_Add_Inquiry', masters.Customer_Add_Inquiry);
router.post('/MaxInquiryNo', masters.MaxInquiryNo);
router.get('/InquiryGET', masters.InquiryGET);
router.post('/EditInquiry', masters.EditInquiry);
router.post('/updateFollowUp', masters.updateFollowUp);
router.get('/FollowUPcountGET', masters.FollowUPcountGET);
router.post('/DeleteFollowup', masters.DeleteFollowup);
router.post('/EditFollowUp', masters.EditFollowUp);
router.post('/InquiryDELETE/:id', masters.InquiryDELETE);
router.get('/InquiryGraphGET', masters.InquiryGraphGET);

// Expense Master
router.post('/ExpenseMaster_Add', masters.ExpenseMaster_Add);
router.get('/ExpenseMasterGET', masters.ExpenseMasterGET);
router.post('/ExpenseMasterDELETE/:id', masters.ExpenseMasterDELETE);
router.post('/ExpenseTypeGET', masters.ExpenseTypeGET);

// Payment 
router.post('/PaymentTransGET', masters.PaymentTransGET);
router.post('/PaymentCBUpdate', masters.PaymentCBUpdate);
router.post('/PaymentCBADD', masters.PaymentCBADD);
router.get('/CustomerApplicationsAccountsGET', masters.CustomerApplicationsAccountsGET);

// CashBank Module
router.post('/maxRecCBNo', masters.maxRecCBNo);
router.post('/maxRecBKNo', masters.maxRecBKNo);

router.post('/CashBankModule', masters.CashBankModule);
router.get('/CashBankModuleListGET', masters.CashBankModuleListGET);
router.post('/CashBankModuleDELETE/:id', masters.CashBankModuleDELETE);
router.get('/CashBankModuleGETVoucheCode', masters.CashBankModuleGETVoucheCode);
router.post('/CashBankModuleUpdate', masters.CashBankModuleUpdate);
router.get('/CashBankModuleAccountsGET', masters.CashBankModuleAccountsGET);

// JV Module
router.post('/maxRecJVNo', masters.maxRecJVNo);
router.post('/AddJVModule', masters.AddJVModule);
router.get('/JVListGET', masters.JVListGET);
router.get('/JVListGETNos', masters.JVListGETNos);
router.post('/JVModuleDELETE/:id', masters.JVModuleDELETE);
router.get('/JVModuleGETVoucheCode', masters.JVModuleGETVoucheCode);
router.post('/JVModuleUpdate', masters.JVModuleUpdate);

// Voucer Master
router.post('/VoucerMasterAdd', masters.VoucerMasterAdd);
router.get('/VoucerMasterListGET', masters.VoucerMasterListGET);
router.post('/VoucerMasterDELETE/:id', masters.VoucerMasterDELETE);
router.get('/VoucherSetupTypesWithIDGET', masters.VoucherSetupTypesWithIDGET);
router.get('/VoucherSetupGET', masters.VoucherSetupGET);
router.post('/VoucherSetup_Add', masters.VoucherSetup_Add);
router.post('/VoucherSetupNames_Add', masters.VoucherSetupNames_Add);
router.get('/VoucherJVGET', masters.VoucherJVGET);
router.get('/VoucherCBGET', masters.VoucherCBGET);

// Change Password
router.post('/changePassword', masters.changePassword);

// Master Imports
router.post('/ImportBank', upload.single('ImportBank'), masters.ImportBank);
router.post('/ImportCity', upload.single('ImportCity'), masters.ImportCity);
router.post('/ImportState', upload.single('ImportState'), masters.ImportState);
router.post('/ImportMake', upload.single('ImportMake'), masters.ImportMake);
router.post('/ImportModel', upload.single('ImportModel'), masters.ImportModel);
router.post('/ImportVariant', upload.single('ImportVariant'), masters.ImportVariant);
router.post('/ImportCustomerRegistration', upload.single('ImportCustomerRegistration'), masters.ImportCustomerRegistration);
router.post('/ImportAccountMaster', upload.single('ImportAccountMaster'), masters.ImportAccountMaster);
router.post('/ImportCustomerApplication', upload.single('ImportCustomerApplication'), masters.ImportCustomerApplication);

module.exports = router; 