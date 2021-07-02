const express = require('express') ;

const budgetController = require('../controller/budgetCode') ;

const router = express.Router() ;

router.get('/addBudgetCode' , budgetController.createBudgetCodeForm) ;
router.post('/addBudgetCode' , budgetController.createBudgetCode) ;
router.get('/getAllocatedBudgetCodes' , budgetController.getAllocatedBudgetCodes) ;
router.post('/getAllocatedBudgetCodes' , budgetController.getAllocatedBudgetCodes) ;
router.get('/getBudgetCodes' , budgetController.getBudgetCodes) ;
router.post('/getBudgetCodes' , budgetController.getFilteredBudgetCodes) ;
router.get('/uploadBudgetCodes' , budgetController.getexcel) ;
router.post('/uploadBudgetCodes' , budgetController.postexcel) ;

module.exports = router ;