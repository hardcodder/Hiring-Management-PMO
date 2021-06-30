const express = require('express') ;

const requestController = require('../controller/request') ;

const isLoggedIn = require('../middleware/isLoggedIn') ;

const isAuth = require('../middleware/isAuth') ;

const isTa = require('../middleware/isTa') ;

const app = express() ;

app.get('/getRequestForm' ,isAuth.isAuth , requestController.getRequestForm) ;

app.get('/getFinanceRequestForm' ,isAuth.isAuth , requestController.getFinanceRequestForm) ;

app.get('/getNewForm' ,isAuth.isAuth , requestController.getNewForm) ;

app.get('/getModifyForm' , isAuth.isAuth , requestController.getModifyForm)

app.post('/cancelRequest' , isAuth.isAuth , requestController.cancelRequest) ;

app.post('/generateRequest' ,isAuth.isAuth , requestController.generateRequest) ;

app.post('/generateFinanceRequest' ,isAuth.isAuth , requestController.generateFinanceRequest) ;

app.post('/modifyRequest' , isAuth.isAuth , requestController.modifyRequest) ;

app.get('/getGeneratedRequests' ,isAuth.isAuth , requestController.getGeneratedRequests) ;

app.get('/getGeneratedFinanceRequests' ,isAuth.isAuth , requestController.getGeneratedFinanceRequests) ;

app.get('/getToBeApprovedRequests' , isAuth.isAuth , requestController.getToBeApprovedRequests) ;

app.get('/getToBeApprovedFinanceRequests' , isAuth.isAuth , requestController.getToBeApprovedFinanceRequests) ;

app.get('/getSingleRequest' , isAuth.isAuth , requestController.getSingleRequest) ;

app.get('/getSingleFinanceRequest' , isAuth.isAuth , requestController.getSingleFinanceRequest) ;

app.get('/getSingleOriginalRequest' , isAuth.isAuth , requestController.getSingleOriginalRequest) ;

app.get('/getApprovedRequests' , isAuth.isAuth , isTa.isTa , requestController.getApprovedRequests) ;

app.get('/getApprovedFinanceRequests' , isAuth.isAuth , requestController.getApprovedFinanceRequests) ;

app.post('/addComment' , isAuth.isAuth , requestController.addComment) ;

app.post('/approveRequest' , isAuth.isAuth , requestController.approveRequest)

app.get('/getComments' , isAuth.isAuth , requestController.getComments) ;

app.get('/getBudgetCodeForm' , isAuth.isAuth , requestController.getBudgetCodeForm) ;


module.exports = app ;