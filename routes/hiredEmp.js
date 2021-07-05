const express = require('express') ;

const empController = require('../controller/hiredEmp') ;


const router = express.Router() ;

router.get('/getHiredEmp' , empController.getHiredEmp) ;
router.post('/getHiredEmp' , empController.getFilteredHiredEmp) ;

router.get('/getUnallocatedHiredEmp' , empController.getUnallocatedHiredEmp) ;
router.post('/getUnallocatedHiredEmp' , empController.getFilteredUnallocatedHiredEmp) ;

router.post('/addemp' , empController.addEmp) ;
router.post('/assignBudgetCodeToEmp', empController.assignBudgetCodeToEmp);

router.get('/tables' , empController.tableHandler) ;

router.get('/reqTable' , empController.getAllRequest) ;
router.post('/reqTable' , empController.postAllRequest) ;

module.exports = router ;
