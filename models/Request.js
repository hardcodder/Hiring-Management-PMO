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
        type : Date
    } ,
    acknowledged: {
        type : Boolean ,
        required : true 
    }
}) ;

module.exports = mongoose.model('Request' , requestSchema) ;