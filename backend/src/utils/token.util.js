const jwt = require('jsonwebtoken');
const config = require("../config/env.js");
const { AppError } = require("./AppError.util.js");

exports.generateAuthTokens = (userId, role) => {
    const payload = { id: userId, role: role };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
}

exports.verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.accessSecret);
    } catch (error) {
        throw new AppError("Invalid or expired access token", 401);
    }
};

exports.verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new AppError("Invalid or expired access token", 403);
    }
};
