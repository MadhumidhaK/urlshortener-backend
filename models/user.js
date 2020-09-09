const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase:true,
        required: true,
        unique:true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isActive: {
        type:Boolean,
        required: true,
        default: false
    },
    password:{
        type: String,
        required: true
    },
    clicksCount: {
        type: Number,
        required: true,
        default: 0
    },
    urlCount: {
        type: Number,
        required: true,
        default: 0
    },
    resetToken: String,
    resetTokenExpiration: Date,
    verificationToken: String,
    verificationTokenExpiration: Date
})

const User = mongoose.model('User', userSchema)

module.exports = User;