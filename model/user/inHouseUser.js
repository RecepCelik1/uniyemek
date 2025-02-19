const baseModel = require('./baseUser');
const mongoose = require('mongoose');

const inHouseUserModel = baseModel.discriminator("InHouse", new mongoose.Schema({
    role: {
        type: String,
        default: "Common",
        immutable: true
    },
    password: {
        type: String,
        select: false
    },
    termsAcceptedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}));


module.exports = inHouseUserModel;