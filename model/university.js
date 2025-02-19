const mongoose = require('mongoose');

const universityModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City"
    },
    mealCarts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Mealcart"
    }
});

module.exports = mongoose.model("university", universityModel);