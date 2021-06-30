const express = require('express') ;

const openingController = require('../controller/opening') ;

const router = express.Router() ;

router.get('/createOpening' , openingController.createOpening) ;

router.get('/getOpenings' , openingController.getOpenings) ;

router.post('/postOpenings' , openingController.postOpenings) ;

module.exports = router ;
