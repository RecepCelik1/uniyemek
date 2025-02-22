const express = require('express');
const contentPanel = require('../service/userPanel');
const isAuth = require('../middleware/isAuth');

class UserPanelController {
    constructor() {
        this.contentService = new contentPanel();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/new-comment', isAuth, this.createNewComment.bind(this)); // confirmed
        this.router.post('/like-cart', isAuth, this.likeCart.bind(this)); // confirmed
        this.router.post('/dislike-cart', isAuth, this.dislikeCart.bind(this)); // confirmed
        this.router.post('/like-comment', isAuth, this.likeComment.bind(this)); // confirmed
        this.router.post('/dislike-comment', isAuth, this.dislikeComment.bind(this)); // confirmed
        this.router.post('/delete-comment', isAuth, this.deleteComment.bind(this)); // confirmed
        this.router.post('/update-comment', isAuth, this.updateComment.bind(this)); // confirmed
        this.router.post('/update-profile', isAuth, this.updateProfile.bind(this));
        //this.router.get('/get-cities', this.getCities.bind(this));
        this.router.get('/get-universities', this.getUniversities.bind(this));
        this.router.post('/get-university', this.getUniversity.bind(this));
        this.router.post('/get-mealcart-comments', this.getMealCartComments.bind(this));
    }

    async createNewComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentData = req.body.commentData;

            const newComment = await this.contentService.createComment(sessionToken, commentData);
            res.status(201).json({
                success: true,
                data: newComment
            });
        } catch (error) {
            next(error);
        }
    }

    async likeCart (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const cartId = req.body.cartId;
            const likeCart = await this.contentService.handleCartLikeButton(sessionToken, cartId);
            res.status(201).json({
                success: true,
                data: likeCart
            });
        } catch (error) {
            next(error);
        }
    }

    async dislikeCart (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const cartId = req.body.cartId;

            const dislike = await this.contentService.handleCartDislikeButton(sessionToken, cartId);
            res.status(201).json({
                success: true,
                data: dislike
            });
        } catch (error) {
            next(error);
        }
    }

    async likeComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentId = req.body.commentId;

            const like = await this.contentService.handleCommentLikeButton(sessionToken, commentId);
            res.status(201).json({
                success: true,
                data: like
            });
        } catch (error) {
            next(error);
        }
    }

    async dislikeComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentId = req.body.commentId;

            const dislike = await this.contentService.handleCommentDislikeButton(sessionToken, commentId);
            res.status(201).json({
                success: true,
                data: dislike
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentId = req.body.commentId;
            const deleteComment = await this.contentService.deleteComment(sessionToken, commentId);
            res.status(200).json({
                success: true,
                data: deleteComment
            });
        } catch (error) {
            next(error);
        }
    }

    async updateComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentData = req.body.commentData;

            const updateComment = await this.contentService.updateComment(sessionToken, commentData);
            res.status(200).json({
                success: true,
                data: updateComment
            });
        } catch (error) {
            next(error);
        }
    }

    async getCities (req, res, next) {
        try {
            const cities = await this.contentService.getCities();
            res.status(200).json({
                success: true,
                data: cities
            });
        } catch (error) {
            next(error);
        }
    }

    async getUniversities (req, res, next) {
        try {
            const universities = await this.contentService.getUniversities();
            res.status(200).json({
                success: true,
                data: universities
            });
        } catch (error) {
            next(error);
        }
    }

    async getUniversity (req, res, next) {
        try {
            const universityId = req.body.universityId;
            const university = await this.contentService.getUniversity(universityId);
            res.status(200).json({
                success: true,
                data: university
            });
        } catch (error) {
            next(error)
        }
    }

    async updateProfile (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const updateData = req.body.updateData
            const updateProfile = await this.contentService.updateProfile(sessionToken, updateData);
            res.status(200).json({
                success: true,
                data: updateProfile
            });
        } catch (error) {   
            next(error)
        }
    }

    async getMealCartComments (req, res, next) {
        try {
            const cartId = req.body.cartId
            const cartComments = await this.contentService.getMealCartComments(cartId);
            res.status(200).json({
                success: true,
                data: cartComments
            });
        } catch (error) {   
            console.log(error)
        }
    }

    getRouter() {
        return this.router;
    }

}

module.exports = new UserPanelController().getRouter();