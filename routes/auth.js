const express = require('express') ;

const authController = require('../controller/auth') ;


const router = express.Router() ;

router.get('/login' , authController.getLogin) ;

router.get('/signup' , authController.getSignup) ;

router.post('/signup' , authController.postSignup) ;

router.post('/login' ,  authController.postLogin) ;

router.get('/usertype' , authController.getUserType) ;

router.post('/usertype' , authController.postUserType) ;

module.exports = router ;
