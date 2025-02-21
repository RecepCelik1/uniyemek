const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: "type",
    collection: "User"
};

// Ana schema tanımlaması
const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
    },
    city: {
        type: String,
    },
    university: {
        type: String,
    },
    department: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,  //adding index to email field
    },
    tokenVersion: { 
        type: Number, 
        default: 0
    },
    isBanned: {
        type: Boolean,
        defaul: false
    },
    avatar: {
        type: String
    }
}, baseOptions);

module.exports = mongoose.model("User", userModel);