const express = require('express') ;

const requestController = require('../controller/request') ;

const isLoggedIn = require('../middleware/isLoggedIn') ;

const isAuth = require('../middleware/isAuth') ;

const app = express() ;

app.get('/getRequestForm' ,isAuth.isAuth , requestController.getRequestForm) ;

app.post('/generateRequest' ,isAuth.isAuth , requestController.generateRequest) ;

app.post('/modifyRequest' , isLoggedIn , requestController.modifyRequest) ;

app.get('/getGeneratedRequests' ,isLoggedIn , requestController.getGeneratedRequests) ;

app.get('/getToBeApprovedRequests' , isLoggedIn , requestController.getToBeApprovedRequests) ;

app.get('/getSingleRequest' , isLoggedIn , requestController.getSingleRequest) ;

app.get('/getApprovedRequests' , isLoggedIn , requestController.getApprovedRequests) ;

app.post('/addComment' , isLoggedIn , requestController.addComment) ;

app.post('/approveRequest' , isLoggedIn , requestController.approveRequest)

module.exports = app ;