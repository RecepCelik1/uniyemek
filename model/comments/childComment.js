const baseComment = require('./baseComment');
const mongoose = require('mongoose');

const fatherCommentModel = baseComment.discriminator("ChildComment", new mongoose.Schema({
    fatherComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
}));

module.exports = fatherCommentModel;