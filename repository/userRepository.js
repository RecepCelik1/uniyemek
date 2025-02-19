const googleUser = require('../model/user/googleUser');
const inhouseUSer = require('../model/user/inHouseUser');
const adminUser = require('../model/user/admin');

class userRepository {
    constructor (model) {
        this.model = model;
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
}

module.exports = userRepository;