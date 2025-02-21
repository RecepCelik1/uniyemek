const universityRepository = require('../repository/universityRepository');
const mealCartRepository = require('../repository/mealCartRepository');
const commentRepository = require('../repository/commentRepository');
const cityRepository = require('../repository/cityRepository');
const userAuthService = require('./userAuthService'); 
const userRepository = require('../repository/userRepository');
const userModel = require('../model/user/baseUser');
const {purifyInput} = require('../utils/xssPurify');
const validateWithSchema = require('../utils/dataValidations');
const { verifyToken } = require('../utils/authUtils');

class userPanelService {

    constructor(){
        this.userRepos = new userRepository(userModel)
        this.userAuth = new userAuthService()
    }
    
    async createComment (sessionToken, commentData, mealCartId) {
        if(!commentData.comment){
            throw new Error('InvalidParameter');
        }
        const user = await this.userAuth.validateSessionToken(sessionToken);
        const purifiedComment = purifyInput(commentData.comment);
        if(commentData.fatherComment){
            const [newComment, fatherComment] = await Promise.all([
                commentRepository.create({ comment: purifiedComment, type: "ChildComment", sender: user._id }),
                commentRepository.findById(commentData.fatherComment) 
            ]);
            if(!fatherComment){
                throw new Error("ItemNotFound");
            }
            fatherComment.childComments.push(newComment._id); await fatherComment.save();
            return newComment;
        }
        const [newComment, mealCart] = await Promise.all([
            commentRepository.create({comment: purifiedComment, type: "FatherComment", sender: user._id}),
            mealCartRepository.findById(mealCartId) 
        ]);
        if(!mealCart){
            throw new Error("ItemNotFound");
        }
        mealCart.comments.push(newComment._id); await mealCart.save();
        return newComment;
    }

    async handleCartLikeButton(sessionToken, cartId) {
        const [user, cart] = await Promise.all([
            this.userAuth.validateSessionToken(sessionToken),
            mealCartRepository.findById(cartId)
        ]);
        if (!cart) {
            throw new Error("ItemNotFound");
        }
        const userLiked = cart.likes.users.some(userId => userId.equals(user._id));
        const userDisliked = cart.dislikes.users.some(userId => userId.equals(user._id));
    
        let updateQuery = {};
    
        if (userLiked) {
            updateQuery = {
                $inc: { "likes.count": -1 },
                $pull: { "likes.users": user._id }
            };
        } else {
            updateQuery = {
                $inc: { "likes.count": 1 },
                $addToSet: { "likes.users": user._id }
            };
    
            if (userDisliked) {
                updateQuery.$inc["dislikes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "dislikes.users": user._id };
            }
        }
    
        return await mealCartRepository.updateOne({ _id: cart._id }, updateQuery);
    }

    async handleCartDislikeButton(sessionToken, cartId) {
        const [user, cart] = await Promise.all([
            this.userAuth.validateSessionToken(sessionToken),
            mealCartRepository.findById(cartId)
        ]);
    
        if (!cart) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = cart.likes.users.some(userId => userId.equals(user._id));
        const userDisliked = cart.dislikes.users.some(userId => userId.equals(user._id));
    
        let updateQuery = {};
    
        if (userDisliked) {
            updateQuery = {
                $inc: { "dislikes.count": -1 },
                $pull: { "dislikes.users": user._id }
            };
        } else {
            updateQuery = {
                $inc: { "dislikes.count": 1 },
                $addToSet: { "dislikes.users": user._id }
            };
    
            if (userLiked) {
                updateQuery.$inc["likes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "likes.users": user._id };
            }
        }
    
        return await mealCartRepository.updateOne({ _id: cart._id }, updateQuery);
    }

    async handleCommentLikeButton(sessionToken, commentId) {
        const [user, comment] = await Promise.all([
            this.userAuth.validateSessionToken(sessionToken),
            commentRepository.findById(commentId)
        ]);
        if (!comment) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = comment.likes.users.some(userId => userId.equals(user._id));
        const userDisliked = comment.dislikes.users.some(userId => userId.equals(user._id));
    
        let updateQuery = {};
    
        if (userLiked) {
            updateQuery = {
                $inc: { "likes.count": -1 },
                $pull: { "likes.users": user._id }
            };
        } else {
            updateQuery = {
                $inc: { "likes.count": 1 },
                $addToSet: { "likes.users": user._id }
            };
    
            if (userDisliked) {
                updateQuery.$inc["dislikes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "dislikes.users": user._id };
            }
        }
    
        return await commentRepository.updateOne({ _id: comment._id }, updateQuery);
    }

    async handleCommentDislikeButton(sessionToken, commentId) {
        const [user, comment] = await Promise.all([
            this.userAuth.validateSessionToken(sessionToken),
            commentRepository.findById(commentId)
        ]);
    
        if (!comment) {
            throw new Error("ItemNotFound");
        }
    
        const userLiked = comment.likes.users.some(userId => userId.equals(user._id));
        const userDisliked = comment.dislikes.users.some(userId => userId.equals(user._id));
    
        let updateQuery = {};
    
        if (userDisliked) {
            updateQuery = {
                $inc: { "dislikes.count": -1 },
                $pull: { "dislikes.users": user._id }
            };
        } else {
            updateQuery = {
                $inc: { "dislikes.count": 1 },
                $addToSet: { "dislikes.users": user._id }
            };
    
            if (userLiked) {
                updateQuery.$inc["likes.count"] = -1;
                updateQuery.$pull = { ...updateQuery.$pull, "likes.users": user._id };
            }
        }
    
        return await commentRepository.updateOne({ _id: comment._id }, updateQuery);
    }

    async deleteComment (sessionToken, commentId) {
        const [user, comment] = await Promise.all([
            this.userAuth.validateSessionToken(sessionToken),
            commentRepository.findById(commentId)
        ]);
        if(!comment){
            throw new Error("ItemNotFound");
        }
        if(user._id.toString() !== comment.sender.toString()){
            throw new Error("UnauthorizedAccess");
        }
        await comment.deleteOne();
        return comment;
    }

    async updateComment (sessionToken, commentData) {
        const [user, comment] = await Promise.all([
            this.userAuth.validateSessionToken(sessionToken),
            commentRepository.findById(commentData.id)
        ]);
        if(!comment){
            throw new Error("ItemNotFound");
        }
        if(user._id.toString() !== comment.sender.toString()){
            throw new Error("UnauthorizedAccess");
        }
        const purifiedComment = purifyInput(commentData.comment);
        comment.comment = purifiedComment; await comment.save();
        return comment;
    }

    async getCities () {
        return await cityRepository.find();
    }

    async getUniversities () {
        return await universityRepository.find();
    }

    async getUniversity (universityId) {
        const mealCarts = await universityRepository.getMealCarts(universityId);
        return mealCarts;
    }

    async updateProfile (sessionToken, updateData) {
        if(!sessionToken){
            throw new Error("InvalidParameter");
        }
        const decodedToken = verifyToken(sessionToken);
        if(decodedToken.tokenType !== "Session") {
            throw new Error("InvalidJWTToken");
        }
        const error = validateWithSchema("profileUpdateSchema", updateData);
        if(error){
            throw new Error(error.message);
        }
        const user = await this.userRepos.updateOne(decodedToken.userId, updateData);
        return user;
    }

}

module.exports = userPanelService