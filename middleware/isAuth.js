const { logOutResponse, verifyToken } = require('../utils/authUtils');

const checkIsAuth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies.sessionToken;
        console.log(sessionToken);
        const decodedToken = verifyToken(sessionToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error)
        logOutResponse(res);
    }
};

module.exports = checkIsAuth;