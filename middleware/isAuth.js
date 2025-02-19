const { logOutResponse, verifyToken } = require('../utils/authUtils');

const checkIsAuth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies.sessionToken;
        const decodedToken = verifyToken(sessionToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        logOutResponse(res);
    }
};

module.exports = checkIsAuth;