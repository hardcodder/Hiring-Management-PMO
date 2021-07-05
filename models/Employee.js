const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const empSchema = new Schema({
    name : {
        type :String ,
        requires : true
    } ,
    email : {
        type : String ,
        required : true
    } ,
    position: {
        type: String
    },
    team: {
        type: String,
    },
    budgetCode: {
        type: String,
    },
    requestAssigned: {
        type: Schema.ObjectId,
        ref: 'Request'
    },

}) ;

module.exports = mongoose.model('Employee' , empSchema) ;