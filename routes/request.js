const express = require('express') ;

const requestController = require('../controller/request') ;

const isLoggedIn = require('../middleware/isLoggedIn') ;

const isAuth = require('../middleware/isAuth') ;

const app = express() ;

app.get('/getRequestForm' ,isAuth.isAuth , requestController.getRequestForm) ;

app.get('/getModifyForm' , isAuth.isAuth , requestController.getModifyForm)

app.post('/cancelRequest' , isAuth.isAuth , requestController.cancelRequest) ;

app.post('/generateRequest' ,isAuth.isAuth , requestController.generateRequest) ;

app.post('/modifyRequest' , isAuth.isAuth , requestController.modifyRequest) ;

app.get('/getGeneratedRequests' ,isAuth.isAuth , requestController.getGeneratedRequests) ;

app.get('/getToBeApprovedRequests' , isAuth.isAuth , requestController.getToBeApprovedRequests) ;

app.get('/getSingleRequest' , isAuth.isAuth , requestController.getSingleRequest) ;

app.get('/getApprovedRequests' , isAuth.isAuth , requestController.getApprovedRequests) ;

app.post('/addComment' , isAuth.isAuth , requestController.addComment) ;

app.post('/approveRequest' , isAuth.isAuth , requestController.approveRequest)

app.get('/getComments' , isAuth.isAuth , requestController.getComments) ;

app.get('/allApprovedRequest' , isAuth.isAuth , requestController.getAllApprovedRequests) ;

app.get('/getSingleApprovedRequest' , isAuth.isAuth , requestController.getSingleApprovedRequest) ;
module.exports = app ;