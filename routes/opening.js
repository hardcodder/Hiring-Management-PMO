const express = require('express') ;

const openingController = require('../controller/opening') ;


const router = express.Router() ;

router.get('/createOpening' , openingController.createOpening) ;

module.exports = router ;
