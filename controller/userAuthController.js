const express = require('express');
const UserAuthService = require('../service/userAuthService');

class UserAuthController {
    constructor() {
        this.authService = new UserAuthService();

        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/register', this.register.bind(this)); //confirmed
        this.router.post('/login', this.login.bind(this)); //confirmed
        this.router.get('/google-oauth', this.googleOauth.bind(this)); // confirmed
        this.router.post('/google-oauth/callback', this.googleOauthCallback.bind(this)); // not tested yet since it requires client
        this.router.get('/validate-session-token', this.validateSessionToken.bind(this)); // confirmed
        this.router.post('/forgot-password', this.forgotPassword.bind(this)); // confirmed
        this.router.post('/validate-reset-token', this.validateResetToken.bind(this)); // confirmed
        this.router.post('/reset-password', this.resetPassword.bind(this)); // confirmed
        this.router.get('/logout', this.logout.bind(this)); // confirmed
    }

    async register(req, res, next) {
        try {
            const newUser = await this.authService.registerUser(req.body);
            this.authService.sessionTokenSender(res, newUser);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const user = await this.authService.validateLoginCredentials(req.body);
            this.authService.sessionTokenSender(res, user);
        } catch (error) {
            next(error);
        }
    }

    async googleOauth(req, res, next) {
        try {
            const GOOGLE_OAUTH_CONSENT_SCREEN_URL = this.authService.googleOAuthUrl();
            res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
        } catch (error) {
            next(error);
        }
    }

    async googleOauthCallback(req, res, next) {
        try {
            const { code } = req.body;
            const googleTokenInfo = await this.authService.googleOauthCallback(code);
            const googleUser = await this.authService.loginWithGoogle(googleTokenInfo);
            this.authService.sessionTokenSender(res, googleUser);
        } catch (error) {
            next(error);
        }
    }

    async validateSessionToken(req, res) {
        try {
            const sessionToken = req.cookies.sessionToken;
            const user = await this.authService.validateSessionToken(sessionToken);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await this.authService.resetMailSender(email);
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }

    async validateResetToken(req, res, next) {
        try {
            const { resetToken } = req.body;
            await this.authService.validateResetToken(resetToken);
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { resetToken, newPassword } = req.body;
            await this.authService.resetPassword(resetToken, newPassword);
            this.authService.logOut(res);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            await this.authService.logOut(res);
        } catch (error) {
            if (!res.headersSent) {
                next(error);
            }
        }
    }

    getRouter() {
        return this.router;
    }

}

module.exports = new UserAuthController().getRouter();