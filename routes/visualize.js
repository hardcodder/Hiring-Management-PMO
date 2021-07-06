const express = require('express') ;

const visualizeController = require('../controller/visualiser') ;

const app = express() ;

app.get('/visualize' , visualizeController.getGraph) ;

app.get('/greenhouseLanding' , visualizeController.getGreenhouse) ;

app.get('/greenhouseTable' , visualizeController.getGreenhouseTable) ;

module.exports = app ;