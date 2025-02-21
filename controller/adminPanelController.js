const express = require('express');
const contentPanel = require('../service/adminPanel/contentPanel');
const isAuth = require('../middleware/isAuth');

class AdminPanelController {
    constructor() {
        this.contentService = new contentPanel();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        //this.router.post('/new-city', isAuth, this.createNewCity.bind(this));
        this.router.post('/new-university', isAuth, this.createNewUniversity.bind(this));
        this.router.post('/new-mealcart', isAuth, this.createNewMealCart.bind(this));
        this.router.post('/new-comment', isAuth, this.createNewComment.bind(this));
        this.router.post('/like-a-cart', isAuth, this.likeCart.bind(this));
        this.router.post('/dislike-a-cart', isAuth, this.dislikeCart.bind(this));
        this.router.post('/like-a-comment', isAuth, this.likeComment.bind(this));
        this.router.post('/dislike-a-comment', isAuth, this.dislikeComment.bind(this));
        this.router.post('/delete-comment', isAuth, this.deleteComment.bind(this));
        this.router.post('/update-comment', isAuth, this.updateComment.bind(this));
        this.router.post('/kick-user', isAuth, this.kickUser.bind(this));

    }

    async createNewCity(req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const cityData = req.body.cityData
            const newCity = await this.contentService.createCity(sessionToken, cityData);
            res.status(201).json({
                success: true,
                data: newCity
            });
        } catch (error) {
            next(error);
        }
    }

    async createNewUniversity(req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const universityData = req.body.universityData
            const newUniversity = await this.contentService.createUniversity(sessionToken, universityData);
            res.status(201).json({
                success: true,
                data: newUniversity
            });
        } catch (error) {
            console.log(error);
        }
    }

    async createNewMealCart (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const mealCartData = req.body.mealCartData;
            const universityId = req.body.universityId;

            const newMealCart = await this.contentService.createMealCart(sessionToken, mealCartData, universityId);
            res.status(201).json({
                success: true,
                data: newMealCart
            });
        } catch (error) {
            console.log(error);
        }
    }

    async createNewComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentData = req.body.commentData;
            const mealCartId = req.body.mealCartId;

            const newComment = await this.contentService.createComment(sessionToken, commentData, mealCartId);
            res.status(201).json({
                success: true,
                data: newComment
            });
        } catch (error) {
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
        }
    }

    async deleteComment (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const commentId = req.body.commentId;

            const deleteComment = await this.contentService.deleteComment(sessionToken, commentId);
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
    }

    async kickUser (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const userId = req.body.userId;

            const kickUser = await this.contentService.kickUser(sessionToken, userId);
            res.status(200).json({
                success: true,
                data: kickUser
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    getRouter() {
        return this.router;
    }

}

module.exports = new AdminPanelController().getRouter();