const mealCartModel = require('../model/mealCart');

class mealCartRepository {
    constructor (model) {
        if(!mealCartRepository.instance){
            this.model = model;
            mealCartRepository.instance = this;
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

    async findOneWithPassword (query){
        return this.model.findOne(query).select("+password");
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

    async bulkWrite(operations) {
        return await this.model.bulkWrite(operations);
    }

    async getMealCartWithComments (cartId) {
        return await this.model.findById(cartId)
        .populate("comments")
        .populate("comments.childComments");
    }

}

module.exports = new mealCartRepository(mealCartModel);