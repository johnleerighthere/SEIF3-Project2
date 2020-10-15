const mongoose = require('mongoose')

const winningsSchema = new mongoose.Schema({

    picture: {
        type: String,
        required: true
    },
    numberBought: {
        type: Number,
        required: true
    },
    prizeWon: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number
    },
    location: [String]


})

const winningsModel = mongoose.model('winning', winningsSchema)

module.exports = winningsModel