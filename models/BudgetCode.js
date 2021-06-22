const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const budgetCodeSchema = new Schema({
    code : {
        type : String ,
        required : true 
    }
}) ;

module.exports = mongoose.model('BudgetCode' , courseSchema)