const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    last_name: {
        type: String,
        required: true,
        max: 100
    },
    pwsalt: {
        type: String,
        quire: true
    },
    hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const UserModel = new mongoose.Schema('user', userSchema)

module.exports = userModel