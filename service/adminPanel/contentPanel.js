const cityRepository = require('../../repository/cityRepository');
const adminPanel = require('./adminPanel');
const universityRepository = require('../../repository/universityRepository');
const mealCartRepository = require('../../repository/mealCartRepository');
const commentRepository = require('../../repository/commentRepository');

const userRepository = require('../../repository/userRepository');
const userModel = require('../../model/user/baseUser');

class contentPanel extends adminPanel{
    constructor(){
        super();
        this.userRepos = new userRepository(userModel);
    }

    async createCity (sessionToken,cityData) {
        const admin = await this.checkUserAuthority(sessionToken);
        const newCity = await cityRepository.create(cityData);
        return newCity;
    }

    async createUniversity (sessionToken, universityData) {
        const admin = await this.checkUserAuthority(sessionToken);
        const newUniversity = await universityRepository.create(universityData);
        return newUniversity;
    }

    async createMealCarts(sessionToken, mealCartDatas, universityId) {
        const admin = await this.checkUserAuthority(sessionToken);
    
        const chunkSize = 5;
        const results = [];
    
        for (let i = 0; i < mealCartDatas.length; i += chunkSize) {
            const chunk = mealCartDatas.slice(i, i + chunkSize);
    
            const bulkOperations = chunk.map(mealCart => ({
                insertOne: { document: mealCart }
            }));
    
            const bulkResult = await mealCartRepository.bulkWrite(bulkOperations);
    
            const mealCartIDs = Object.values(bulkResult.insertedIds);
    
            results.push(...mealCartIDs);
    
            await universityRepository.updateOne(
                universityId, 
                { $addToSet: { mealCarts: { $each: mealCartIDs } } }
            );
        }
    
        return results;
    }
    
    
    
    
    async createComment (sessionToken, commentData, mealCartId) {
        const admin = await this.checkUserAuthority(sessionToken)
        if(commentData.fatherComment){
            const [newComment, fatherComment] = await Promise.all([
                commentRepository.create({...commentData, type: "ChildComment", sender: admin._id}),
                commentRepository.findById(commentData.fatherComment) 
            ]);
            if(!fatherComment){
                throw new Error("ItemNotFound");
            }
            fatherComment.childComments.push(newComment._id); await fatherComment.save();
            return newComment;
        }
        const [newComment, mealCart] = await Promise.all([
            commentRepository.create({...commentData, type: "FatherComment", sender: admin._id}),
            mealCartRepository.findById(mealCartId) 
        ]);
        if(!mealCart){
            throw new Error("ItemNotFound");
        }
        mealCart.comments.push(newComment._id); await mealCart.save();
        return newComment;
    }

    async handleCartLikeButton(sessionToken, cartId) {
        const [admin, cart] = await Promise.all([
            this.checkUserAuthority(sessionToken),
            mealCartRepository.findById(cartId)
        ]);
    
        if (!cart) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = cart.likes.users.some(userId => userId.equals(admin._id));
        const userDisliked = cart.dislikes.users.some(userId => userId.equals(admin._id));
    
        let updateQuery = {};
    
        if (userLiked) {
            updateQuery = {
                $inc: { "likes.count": -1 },
                $pull: { "likes.users": admin._id }
            };
        } else {
            updateQuery = {
                $inc: { "likes.count": 1 },
                $addToSet: { "likes.users": admin._id }
            };
    
            if (userDisliked) {
                updateQuery.$inc["dislikes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "dislikes.users": admin._id };
            }
        }
    
        return await mealCartRepository.updateOne({ _id: cart._id }, updateQuery);
    }
    
    async handleCartDislikeButton(sessionToken, cartId) {
        const [admin, cart] = await Promise.all([
            this.checkUserAuthority(sessionToken),
            mealCartRepository.findById(cartId)
        ]);
    
        if (!cart) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = cart.likes.users.some(userId => userId.equals(admin._id));
        const userDisliked = cart.dislikes.users.some(userId => userId.equals(admin._id));
    
        let updateQuery = {};
    
        if (userDisliked) {
            updateQuery = {
                $inc: { "dislikes.count": -1 },
                $pull: { "dislikes.users": admin._id }
            };
        } else {
            updateQuery = {
                $inc: { "dislikes.count": 1 },
                $addToSet: { "dislikes.users": admin._id }
            };
    
            if (userLiked) {
                updateQuery.$inc["likes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "likes.users": admin._id };
            }
        }
    
        return await mealCartRepository.updateOne({ _id: cart._id }, updateQuery);
    }

    async handleCommentLikeButton(sessionToken, commentId) {
        const [admin, comment] = await Promise.all([
            this.checkUserAuthority(sessionToken),
            commentRepository.findById(commentId)
        ]);
        if (!comment) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = comment.likes.users.some(userId => userId.equals(admin._id));
        const userDisliked = comment.dislikes.users.some(userId => userId.equals(admin._id));
    
        let updateQuery = {};
    
        if (userLiked) {
            updateQuery = {
                $inc: { "likes.count": -1 },
                $pull: { "likes.users": admin._id }
            };
        } else {
            updateQuery = {
                $inc: { "likes.count": 1 },
                $addToSet: { "likes.users": admin._id }
            };
    
            if (userDisliked) {
                updateQuery.$inc["dislikes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "dislikes.users": admin._id };
            }
        }
    
        return await commentRepository.updateOne({ _id: comment._id }, updateQuery);
    }

    async handleCommentDislikeButton(sessionToken, commentId) {
        const [admin, comment] = await Promise.all([
            this.checkUserAuthority(sessionToken),
            commentRepository.findById(commentId)
        ]);
    
        if (!comment) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = comment.likes.users.some(userId => userId.equals(admin._id));
        const userDisliked = comment.dislikes.users.some(userId => userId.equals(admin._id));
    
        let updateQuery = {};
    
        if (userDisliked) {
            updateQuery = {
                $inc: { "dislikes.count": -1 },
                $pull: { "dislikes.users": admin._id }
            };
        } else {
            updateQuery = {
                $inc: { "dislikes.count": 1 },
                $addToSet: { "dislikes.users": admin._id }
            };
    
            if (userLiked) {
                updateQuery.$inc["likes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "likes.users": admin._id };
            }
        }
    
        return await commentRepository.updateOne({ _id: comment._id }, updateQuery);
    }

    async deleteComment (sessionToken, commentId) {
        const admin = await this.checkUserAuthority(sessionToken);
        const deleteComment = await commentRepository.deleteOne(commentId);
        return deleteComment;
    }
    
    async updateComment (sessionToken, commentData) {
        const admin = await this.checkUserAuthority(sessionToken);
        const updateComment = await commentRepository.updateOne(commentData.id, { comment: commentData.comment });
        return updateComment;
    }

    async kickUser (sessionToken, userId) {
        const admin = await this.checkUserAuthority(sessionToken);
        const kickUser = await this.userRepos.updateOne(userId, { isBanned: true });
        return kickUser;
    }

    async deleteMealCart (sessionToken, cartId) {
        const admin = await this.checkUserAuthority(sessionToken);
        const deletedCart = await mealCartRepository.deleteOne(cartId);
        return deletedCart;
    }

    async deleteAllMealCarts (sessionToken, universityId) {
        const admin = await this.checkUserAuthority(sessionToken);
        const deleteAll = await mealCartRepository.deleteMany({universityId: universityId});
        return deleteAll;
    }

    //TO DO: ADD AN CART RESET FUNCTİON

}

module.exports = contentPanel;