const commentModel = require('../model/comments/baseComment');
const fatherComment = require('../model/comments/fatherCommend');
const childComment = require('../model/comments/childComment');

class commentRepository {
    constructor (model) {
        if(!commentRepository.instance){
            this.model = model;
            commentRepository.instance = this;
        }
    }

    async find(query) {
        return this.model.find(query);
    }

    async findOne(query) {
        return this.model.findOne(query);
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async create(data) {
        return this.model.create(data);
    }

    async updateOne(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async updateMany (filter, updateDetails) {
        return await this.model.updateMany(
            filter,
            updateDetails
        );
    }

    async deleteOne(id){
        return this.model.findByIdAndDelete(id);
    }

    async deleteMany (filter) {
        return await this.model.deleteMany(filter);
    }

    async getCartCommentWithReplies (mealCartId){
        return await fatherComment.find({mealCartId}).populate("childComments");
    }
}

module.exports = new commentRepository(commentModel);