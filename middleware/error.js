const ErrorHandler = require('../utils/errorHandler');
const reportErrorToAdmins = require('../utils/reportErrors');

module.exports = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Identify messages based on error types
    const errorMessages = {
        TokenExpiredError: {
            message: "Your token has expired. Please get a new token.",
            statusCode: 401,
        },
        UserBanned: {
            message: "Politikalarımızı ihlal ettiğiniz için hesabınız askıya alınmıştır.",
            statusCode: 403,
        },
        CityNotFound: {
            message: "Şehir bulunamadı...",
            statusCode: 404,
        },
        InvalidParameter: {
            message: "Invalid Parameter",
            statusCode: 400
        },
        UserAlreadyExist: {
            message: "User is already registered.",
            statusCode: 400
        },
        EmailAlreadyExist: {
            message: "Apparently this e-mail address is already in use.",
            statusCode: 400
        },
        RegisteredByGoogle: {
            message: "There is a google user registered with this mail.",
            statusCode: 400
        },
        InvalidJWTToken: {
            message: "Invalid or expired token",
            statusCode: 401
        },
        UserNotFound: {
            message: "User not found",
            statusCode: 404
        },
        WrongPasswordOrMail: {
            message: "Wrong email or password. Please try again.",
            statusCode: 401
        },
        PasswordsNotMatches: {
            message: "Wrong password. Please try again",
            statusCode: 401
        },
        OauthCodeMissing: {
            message: "OAuth authorization code is missing. Please provide the authorization code to proceed.",
            statusCode: 400
        },
        InvalidGoogleAccesToken: {
            message: "Invalid google access token.",
            statusCode: 400
        },
        FailedToFetchTokenInfo: {
            message: "Failed To fetch oauth access token info",
            statusCode: 400
        },
        GoogleAccountRegisteredAsInHouse: {
            message: "It seems that a user with this email is registered internally in our system.",
            statusCode: 400
        },
        AccountAlreadyActivated: {
            message: "It looks like the account has already been activated.",
            statusCode: 400
        },
        UnauthorizedAccess: {
            message: "You are not authorized for this operation.",
            statusCode: 401
        },
        GoogleUserCannotDoThisAction: {
            message: "As a Google user, you cannot perform this action.",
            statusCode: 400
        },
        NotificationNotFound: {
            message: "Notification not found",
            statusCode: 404
        },
        ItemNotFound: {
            message: "Item not found",
            statusCode: 404
        },
        ErrorOccured: {
            message: "An error occurred pls try again later.",
            statusCode: 500
        },
    };



    // Error Type Determination
    const errorDetails = errorMessages[err.message] || {
        message: "Internal Server Error",
        statusCode: 500,
    };

    // Notification to admins for unexpected errors
    if (!errorMessages[err.message]) {
        const inputData = req.body;
        reportErrorToAdmins(req.user ? req.user.id : "Anonymous", err.message, err.stack, req.originalUrl, inputData);
    }

    const errorResponse = new ErrorHandler(errorDetails.message, errorDetails.statusCode);

    res.status(errorResponse.statusCode).json({
        success: false,
        message: errorResponse.message,
    });
};