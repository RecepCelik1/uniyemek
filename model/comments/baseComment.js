const mongoose = require("mongoose");

const baseOptions = {
    discriminatorKey: "type",
    collection: "Comment",
    timestamps: true
};

const commentModel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true
    },
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
}, baseOptions);

module.exports = mongoose.model("Comment", commentModel);
