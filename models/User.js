const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const userSchema = new Schema({
    name : {
        type :String ,
        requires : true
    } ,
    email : {
        type : String ,
        required : true
    } ,
    password : {
        type : String ,
        required : true
    }
}) ;

module.exports = mongoose.model('User' , userSchema) ;