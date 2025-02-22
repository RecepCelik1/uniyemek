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
/*         this.router.post('/new-comment', isAuth, this.createNewComment.bind(this));
        this.router.post('/like-a-cart', isAuth, this.likeCart.bind(this));
        this.router.post('/dislike-a-cart', isAuth, this.dislikeCart.bind(this));
        this.router.post('/like-a-comment', isAuth, this.likeComment.bind(this));
        this.router.post('/dislike-a-comment', isAuth, this.dislikeComment.bind(this));
        this.router.post('/delete-comment', isAuth, this.deleteComment.bind(this));
        this.router.post('/update-comment', isAuth, this.updateComment.bind(this));
 */     this.router.post('/kick-user', isAuth, this.kickUser.bind(this));
        this.router.post('/delete-mealcart', isAuth, this.deleteMealCart.bind(this));
        this.router.post('/delete-all-mealcarts', isAuth, this.deleteAllMealCarts.bind(this));
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
            next(error);
        }
    }

    async createNewMealCart (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const mealCartDatas = req.body.mealCartDatas;
            const universityId = req.body.universityId
            const newCartIds = await this.contentService.createMealCarts(sessionToken, mealCartDatas, universityId);
            res.status(201).json({
                success: true,
                data: newCartIds
            });
        } catch (error) {
            console.log(error)
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
                data: {}
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
            next(error);
        }
    }
    
    async deleteMealCart (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const cartId = req.body.cartId;
            const deletedCart = await this.contentService.deleteMealCart(sessionToken, cartId);
            res.status(200).json({
                success: true,
                data: deletedCart
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAllMealCarts (req, res, next) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const universityId = req.body.universityId;
            const deletedCarts = await this.contentService.deleteAllMealCarts(sessionToken, universityId);
            res.status(200).json({
                success: true,
                data: deletedCarts
            });
        } catch (error) {
            next(error);
        }
    }

    getRouter() {
        return this.router;
    }

}

module.exports = new AdminPanelController().getRouter();