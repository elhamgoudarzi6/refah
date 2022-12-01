const express = require('express');
const router = express.Router();
const adminRouter = express.Router();

// middlewares
const apiAuthAdminUser = require('./middleware/apiAuthAdmin');
const apiAuth = require('./middleware/apiAuth');
const apiAdmin = require('./middleware/apiAdmin');
const { uploadImage } = require('./middleware/UploadMiddleware');
const { uploadFiles } = require('./middleware/UploadMiddleware');

//user Controllers
const { api: ControllerApi } = config.path.controllers;
const HomeController = require(`${ControllerApi}/v1/HomeController`);
const AuthController = require(`${ControllerApi}/v1/user/AuthController`);
const UploadController = require(`${ControllerApi}/v1/user/UploadController`);
const RequestController = require(`${ControllerApi}/v1/user/RequestController`);
const LoanController = require(`${ControllerApi}/v1/user/LoanController`);

//admin controller
const AdminAuthController = require(`${ControllerApi}/v1/admin/AuthController`);
const AdminUploadController = require(`${ControllerApi}/v1/admin/UploadController`);
const AdminEmployeeController = require(`${ControllerApi}/v1/admin/EmployeeController`);
const AdminLoanController = require(`${ControllerApi}/v1/admin/LoanController`);
const AdminRequestController = require(`${ControllerApi}/v1/admin/RequestController`);

//router.get('/' , HomeController.index);
//router.get('/version', HomeController.version);
//admin router*********************************************
//upload image
adminRouter.post('/image', uploadImage.single('image'), AdminUploadController.uploadImage.bind(AdminUploadController));
adminRouter.post('/login', AdminAuthController.login.bind(AdminAuthController));
//adminRouter.post('/register',apiAuthAdminUser, AdminAuthController.register.bind(AdminAuthController));
adminRouter.put('/updateAdmin/:id',apiAuthAdminUser, AdminAuthController.updateAdmin.bind(AdminAuthController));
adminRouter.get('/allAdmin',apiAuthAdminUser, AdminAuthController.index.bind(AdminAuthController));
adminRouter.post('/getToken/:id', AdminAuthController.getToken.bind(AdminAuthController));

//loan
adminRouter.post('/storeLottery',apiAuthAdminUser,apiAuthAdminUser, AdminLoanController.storeLottery.bind(AdminLoanController));
adminRouter.post('/loan',apiAuthAdminUser, apiAuthAdminUser,AdminLoanController.store.bind(AdminLoanController));
adminRouter.put('/loan/:id',apiAuthAdminUser, AdminLoanController.update.bind(AdminLoanController));
adminRouter.delete('/loan/:id',apiAuthAdminUser, AdminLoanController.destroy.bind(AdminLoanController));
adminRouter.get('/loan',apiAuthAdminUser, AdminLoanController.index.bind(AdminLoanController));
//employee
adminRouter.get('/employee',apiAuthAdminUser, AdminEmployeeController.index.bind(AdminEmployeeController));
adminRouter.post('/employee',apiAuthAdminUser, AdminEmployeeController.store.bind(AdminEmployeeController));
adminRouter.put('/employee/:id', apiAuthAdminUser,AdminEmployeeController.update.bind(AdminEmployeeController));
adminRouter.get('/allRequestEmployee',apiAuthAdminUser, AdminEmployeeController.allRequestEmployee.bind(AdminEmployeeController));
adminRouter.get('/showMrsRequest',apiAuthAdminUser, AdminEmployeeController.showMrsRequest.bind(AdminEmployeeController));
//request
adminRouter.get('/listRequestMrs', AdminRequestController.listRequestMrs.bind(AdminRequestController));
adminRouter.get('/listWinMrs', AdminRequestController.listWinMrs.bind(AdminRequestController));
adminRouter.post('/listWinByLoanID',apiAuthAdminUser, AdminRequestController.listWinByLoanID.bind(AdminRequestController));
adminRouter.get('/listWin/:id',apiAuthAdminUser, AdminRequestController.listWin.bind(AdminRequestController));

adminRouter.post('/setFinalWin',apiAuthAdminUser, AdminRequestController.setFinalWin.bind(AdminRequestController));
adminRouter.post('/requestWin',apiAuthAdminUser, AdminRequestController.RandomWin.bind(AdminRequestController));
adminRouter.get('/request',apiAuthAdminUser, AdminRequestController.index.bind(AdminRequestController));
adminRouter.put('/updateDateBank', AdminRequestController.updateDateBank.bind(AdminRequestController));
adminRouter.put('/updateBranch', AdminRequestController.updateBranch.bind(AdminRequestController));
adminRouter.get('/allRequest',apiAuthAdminUser, AdminRequestController.index2.bind(AdminRequestController));

//request Leasing
adminRouter.get('/showAllRequestLeasing', AdminRequestController.showAllRequestLeasing.bind(AdminRequestController));
adminRouter.get('/listWinrequestLeasing', AdminRequestController.listWinrequestLeasing.bind(AdminRequestController));
adminRouter.get('/countrequestLeasing', RequestController.countrequestLeasing.bind(AdminRequestController));

//adminRouter.get('/AllRequest', AdminRequestController.AllRequest.bind(AdminRequestController));

//adminRouter.get('/request', AdminRequestController.showRequest.bind(AdminRequestController));

//user router***********************************************
//upload image
router.post('/image', uploadImage.single('image'), UploadController.uploadImage.bind(UploadController));
// auth student
router.post('/register', AuthController.register.bind(AuthController));
router.post('/register1', AuthController.register1.bind(AuthController));
router.put('/updateDate', AuthController.updateDate.bind(AuthController));
router.put('/updateAll', AuthController.updateAll.bind(AuthController));
router.post('/getToken/:id',AuthController.getToken.bind(AuthController));

router.post('/login', AuthController.login.bind(AuthController));
router.put('/updateEmployee/:id',apiAuth, AuthController.UpdateEmployee.bind(AuthController));
router.put('/updatemrs', AuthController.updatemrs.bind(AuthController));
router.post('/detailEmployee', AuthController.detailEmployee.bind(AuthController));
router.put('/updateStock', AuthController.updateStock.bind(AuthController));

//request leasing
router.post('/requestLeasing', RequestController.requestLeasing.bind(RequestController));
router.post('/showrequestLeasing', RequestController.showrequestLeasing.bind(RequestController));
router.get('/countrequestLeasing', RequestController.countrequestLeasing.bind(RequestController));

//request
router.get('/countRequest/:id',apiAuth, RequestController.countRequest.bind(RequestController));
router.post('/request',apiAuth, RequestController.store.bind(RequestController));
router.get('/showLock',apiAuth, RequestController.showLock.bind(RequestController));
router.get('/showNotification',apiAuth, RequestController.showNotification.bind(RequestController));
router.post('/storeNotification', RequestController.storeNotification.bind(RequestController));
router.get('/showDeadline',apiAuth, RequestController.showDeadline.bind(RequestController));
router.post('/storeDeadline', RequestController.storeDeadline.bind(RequestController));
router.delete('/deleteRequest/:id',apiAuth, RequestController.destroy.bind(RequestController));
router.post('/showRequest',apiAuth, RequestController.showRequest.bind(RequestController));
router.post('/showResult',apiAuth, RequestController.showResult.bind(RequestController));
router.post('/showResultAndDate',apiAuth, RequestController.showResultAndDate.bind(RequestController));
router.get('/countRequest',apiAuth, RequestController.countRequest.bind(RequestController));

//loan
router.get('/loan',apiAuth, LoanController.index.bind(LoanController));
router.get('/loan/:id',apiAuth, LoanController.single.bind(LoanController));

//setting routes***********************************
// router.use('/user', [customerRouter, apiAuthcustomer])
// router.use('/admin', [adminRouter , apiAuthAdminUser]);

router.use('/admin', adminRouter);
router.use('/', router);
router.use(function(req, res, next) {
    res.Header("Access-Control-Allow-Origin", 'http://194.5.175.25:3003/,http://localhost:4200/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
module.exports = router;
