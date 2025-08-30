const express=require("express");

const router=express.Router();
const authenticate=require("../middleware/authenticat.js")

const user_rights=require("../controllers/user_rights_controller.js")
const {validateemployeegrade_masterAdd}=require("../middleware/validator.js")

router.post('/securityAdd', user_rights.securityAdd);
router.post('/Security_Auto_Add', user_rights.Security_Auto_Add);
router.get('/securityGET', user_rights.securityGET);
router.post('/securityDELETE/:id', user_rights.securityDELETE);

router.get('/UsersGET', user_rights.UsersGET);
router.get('/UserDataGET', user_rights.UserDataGET);
router.get('/AllrightsGET', user_rights.AllrightsGET);
router.post('/MasterGET', user_rights.MasterGET);
router.post('/UpdateUserDetails', user_rights.UpdateUserDetails);
router.post('/CompanyGET', user_rights.CompanyGET);
router.post('/DivSchemaGET', user_rights.DivSchemaGET);
router.post('/AddUser', user_rights.AddUser);
router.post('/user_rights_securityGET', user_rights.user_rights_securityGET);
router.post('/user_rights_userGET', user_rights.user_rights_userGET);
router.post('/Addautho_setup', user_rights.Addautho_setup);
router.post('/autho_setupGET', user_rights.autho_setupGET);
router.post('/Company_Add', user_rights.Company_Add);
router.get('/Company_masterGET', user_rights.Company_masterGET);
router.post('/Division_Add', user_rights.Division_Add);
router.get('/Division_masterGET', user_rights.Division_masterGET);

module.exports=router; 