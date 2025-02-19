const baseModel = require('./baseUser');
const mongoose = require('mongoose');

const googleUserModel = baseModel.discriminator("Google", new mongoose.Schema({
    role: {
        type: String,
        default: "Common",
        immutable: true
    },
    termsAcceptedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}));

module.exports = googleUserModel;
