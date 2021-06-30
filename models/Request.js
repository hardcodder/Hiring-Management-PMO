const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const requestSchema = new Schema({
    finance:{
        type:Boolean
    } ,
    generatedBy : {
        type:String ,
        required : true 
    } ,
    toBeApprovedBy :  {
        type :String ,
        required : true
    } ,
    requestBody : {
        type : Object ,
        required : true 
    } ,
    state : {
        type : String ,
        required : true 
    } ,
    comments : [
        {
            writtenBy : {
                type : String ,
                required : true 
            } ,
            text : {
                type : String ,
                required : true
            }
        }
    ] ,
    date : {
        type : Date,
        default: Date.now
    } ,
    acknowledged:{
        type : Boolean,
        default: false 
    } ,
    reason : {
        type : String 
    },
}) ;

module.exports = mongoose.model('Request' , requestSchema) ;