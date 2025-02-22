const { logOutResponse, verifyToken } = require('../utils/authUtils');

const checkIsAuth = async (req, res, next) => {
    let sessionToken;
    let decodedToken;
    try {
        sessionToken = req.cookies.sessionToken;
        decodedToken = verifyToken(sessionToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error)
        res.status(200).json({
            sessionToken,
            decodedToken
        });
    }
};

module.exports = checkIsAuth;