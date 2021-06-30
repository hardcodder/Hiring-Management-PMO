const express = require('express') ;

const authController = require('../controller/auth') ;


const router = express.Router() ;

router.get('/login' , authController.getLogin) ;

router.get('/signup' , authController.getSignup) ;

router.post('/signup' , authController.postSignup) ;

router.post('/login' ,  authController.postLogin) ;

router.get('/logout' , authController.getLogout) ;

module.exports = router ;
