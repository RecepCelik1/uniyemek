const mongoose = require('mongoose');

const universityModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mealCarts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Mealcart"
    },
    logo: {
        type: String,
        default: ""
    },
    mealPrice: {
        type: Number
    }
});

module.exports = mongoose.model("university", universityModel);