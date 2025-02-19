const baseComment = require('./baseComment');
const mongoose = require('mongoose');

const fatherCommentModel = baseComment.discriminator("FatherComment", new mongoose.Schema({
    childComments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment"
    }
}));

module.exports = fatherCommentModel;