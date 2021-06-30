const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const openingSchema = new Schema({
    requestId: {
        type: Schema.ObjectId,
        ref: 'Request'
    },
    budgetCode: {
        type: String,
    },
    status: {
        type: String,
        default: 'OPENED'
    },
    date: {
        type: Date,
        default: Date.now
    }
}) ;

module.exports = mongoose.model('Opening' , openingSchema)