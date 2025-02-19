const universityModel = require('../model/university');

class universityRepository {
    constructor (model) {
        if(!universityRepository.instance){
            this.model = model;
            universityRepository.instance = this;
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
}

module.exports = new universityRepository(universityModel);