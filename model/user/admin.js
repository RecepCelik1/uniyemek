const baseModel = require('./baseUser');
const mongoose = require('mongoose');

const adminModel = baseModel.discriminator("Admin", new mongoose.Schema({
    role: {
        type: String,
        default: "Admin",
        immutable: true
    },
}));

module.exports = adminModel;