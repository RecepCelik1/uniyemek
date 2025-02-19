const mongoose = require('mongoose');

const cityModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    universities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "University"
    }
}, { timestamps: true });

module.exports = mongoose.model("City", cityModel);