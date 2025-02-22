const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

const generateToken = (payload, expiresIn) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
    } catch (error) {
        throw new Error('InvalidJWTToken');
    }
};

const sendSessionToken = (res, token, expiresInDays, statusCode, user) => {

    const expires = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const defaultOptions = {
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires
    };

    res.status(statusCode).cookie('sessionToken', token, defaultOptions).json({
        success: true,
        data: user,
    });
};

const logOutResponse = (res) => {
    const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0)
    }
    return res.status(200)
        .cookie('sessionToken', null, defaultOptions)
        .json({
            success: true,
            message: 'Logged out successfully',
            redirectUrl: `${process.env.FRONTEND_URL}/login`
        });
}

const authorizationChecker = (user, authorizationList) => {
    const userAuthority = user.role;
    if(!user.role){
        throw new Error("InvalidParameter");
    }
    if(!Array.isArray(authorizationList)) {
        throw new Error("InvalidParameter");
    }
    if(!authorizationList.includes(userAuthority)){
        return false;
    }
    return true;
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    sendSessionToken,
    logOutResponse,
    authorizationChecker,
};