const mongoose = require('mongoose');

const mealcartModel = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    mealType: [
        {
            name: {
                type: String,
                required: true
            },
            meals: {
                type: [String]
            },
            avgCalori: {
                type: String
            }
        }
    ],
    likes: {
        count: { type: Number, default: 0 },
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        }
    },
    dislikes: {
        count: { type: Number, default: 0 },
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        }
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: []
    }
});

module.exports = mongoose.model("Mealcart", mealcartModel);