const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const budgetCodeSchema = new Schema({
    budgetCode : {
        type : String ,
        required : true,
        unique: true
    },
    position : {
        type : String , 
        required : true
    },
    status : {
        type : String ,
    },
    assignedTo: {
        type: String
    },
    team: {
        type: String
    },
    reportingManager : {
        type: String,
    }
}) ;

module.exports = mongoose.model('BudgetCode' , budgetCodeSchema)