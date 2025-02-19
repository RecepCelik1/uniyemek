
const { hashPassword, comparePassword, generateToken, verifyToken, logOutResponse, sendSessionToken } = require('../utils/authUtils');
const  validateWithSchema = require('../utils/dataValidations');

const mailTransporter = require('../utils/sendMail');
const resetMail = require('../assets/mails/passwordResetMail');

const googleApi = require('../utils/googleApi');
const userModel = require('../model/user/baseUser');
const userRepository = require('../repository/userRepository');
class UserAuthService {

    constructor() { 
        this.userRepos = new userRepository(userModel)
    }

    async registerUser(userData) {
        const error = validateWithSchema("registerSchema", userData);
        if(error){
            throw new Error("InvalidParameter");
        }
        const isUserExist = await this.userRepos.findOne({ email: userData.email })
        if (isUserExist) {
            if (isUserExist.type === "Google") {
                throw new Error("RegisteredByGoogle");
            }
            throw new Error("UserAlreadyExist");
        }
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await this.userRepos.create({
                ...userData,
                type: "InHouse",
                password: hashedPassword,
                role: "Common",
        })
        const newUserJson = newUser.toObject();
        delete newUserJson.password;
        return newUserJson;
    }

    async sessionTokenSender (res, user) {
        const sessionToken = this.generateSessionToken(user);
        sendSessionToken(res, sessionToken, 15, 201, user);
    } 

    generateSessionToken (user) {
        return generateToken({ userId: user._id, tokenVersion: user.tokenVersion, tokenType: "Session" }, "15d");
    };
        
    generatePasswordResetToken (user) {
        return generateToken({ userId: user._id, tokenType: "PasswordReset" }, "5m");
    };

    async validateSessionToken(sessionToken) {
        if(!sessionToken){
            throw new Error("InvalidParameter");
        }
        const decodedToken = verifyToken(sessionToken);
        if(decodedToken.tokenType !== "Session") {
            throw new Error("InvalidJWTToken");
        }
        const user = await this.userRepos.findById(decodedToken.userId);
        if(!user) {
            throw new Error("UserNotFound");
        }
        if(user.isBanned){
            throw new Error("UserBanned");
        }
        if(user.tokenVersion !== decodedToken.tokenVersion) {
            throw new Error("InvalidJWTToken");
        }
        const userObj = user.toObject();
        return userObj;
    }

    async validateLoginCredentials(credentialData) {
        const error = validateWithSchema("credentialSchema", credentialData);
        if(error){
            throw new Error("InvalidParameter");
        }
        const user = await this.userRepos.findOneWithPassword({ email: credentialData.email });
        if(!user) {
            throw new Error("WrongPasswordOrMail");
        }
        const isPasswordValid = await comparePassword(credentialData.password, user.password);
        if(!isPasswordValid) {
            throw new Error("WrongPasswordOrMail");
        }
        if(user.isBanned){
            throw new Error("UserBanned");
        }
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    googleOAuthUrl() {
        const GOOGLE_OAUTH_SCOPES = [
            "https%3A//www.googleapis.com/auth/userinfo.email",
            "https%3A//www.googleapis.com/auth/userinfo.profile",
        ];
        const state = "some_state";
        const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
        const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
        return GOOGLE_OAUTH_CONSENT_SCREEN_URL;
    }
    
    async googleOauthCallback(oauthCode) {
        if(!oauthCode) {
            throw new Error("OauthCodeMissing");
        }
        const access_token_data = await googleApi.fetchTokenData(oauthCode);
        const token_info_response = await googleApi.fetchTokenInfo(access_token_data.id_token);
        return token_info_response;
    }

    async loginWithGoogle(oauthUserCredentials) {
        const {email, given_name, family_name, picture } = oauthUserCredentials;
        
        const googleUser = await this.userRepos.findOne({email: email});
        if(googleUser && googleUser.type === "Google") {
            if(googleUser.isBanned){
                throw new Error("UserBanned");
            }
            const userObj = googleUser.toObject();
            return userObj;
        }
        if(googleUser && googleUser.type !== "Google") {
            throw new Error("GoogleAccountRegisteredAsInHouse");
        }
        const newUser= this.userRepos.create({
                name: given_name,
                surname: family_name,
                email,
                termsAcceptedAt: Date.now(),
                role: "Common",
                type: "Google"
        });
        const newUserObj = newUser.toObject();
        return newUserObj;
    }

    async resetMailSender(email) {
        const user = await this.userRepos.findOne({email: email});
        if(!user) {
            throw new Error("UserNotFound");
        }   
        if(user.type === "Google") {
            throw new Error("RegisteredByGoogle");
        }
        const resetToken = this.generatePasswordResetToken(user);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const mailContent = resetMail(user.email, user.name, resetUrl);
        await mailTransporter(mailContent);
    }

    async validateResetToken(resetToken) {
        if(!resetToken) {
            throw new Error("InvalidParameter");
        }
        const decodedToken = verifyToken(resetToken);
        if(decodedToken.tokenType !== "PasswordReset") {
            throw new Error("InvalidJWTToken");
        }
        const user = await this.userRepos.findById(decodedToken.userId);
        if(!user) {
            throw new Error("UserNotFound");
        }
        if(user.isGoogleUser){
            throw new Error("RegisteredByGoogle")
        }
    }

    async resetPassword(resetToken, newPassword) {
        if(!resetToken) {
            throw new Error("InvalidParameter");
        }
        const decodedToken = verifyToken(resetToken);
        if(decodedToken.tokenType !== "PasswordReset") {
            throw new Error("InvalidJWTToken");
        }
        const user = await this.userRepos.findOneWithPassword({ _id: decodedToken.userId });
        if(!user) {
            throw new Error("UserNotFound");
        }
        const error = validateWithSchema("credentialSchema", {email : user.email, password: newPassword});
        if(error) {
            throw new Error("InvalidParameter");
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.tokenVersion += 1;
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    async logOut(res) {
        logOutResponse(res);    
    }

}

module.exports = UserAuthService;