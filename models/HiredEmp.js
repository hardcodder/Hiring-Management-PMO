const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const hiredEmpSchema = new Schema({
    name : {
        type :String ,
        requires : true
    } ,
    email : {
        type : String ,
        required : true
    } ,
    applicationId: {
        type: String ,
    },
    position: {
        type: String
    }
}) ;

module.exports = mongoose.model('HiredEmp' , hiredEmpSchema) ;