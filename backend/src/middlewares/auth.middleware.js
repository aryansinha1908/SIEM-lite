const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError.util.js");
const config = require("../config/env");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return next(new AppError("Not Authorized to access this Route", 401));
        }

        const decoded = jwt.verify(token, config.jwt.accessSecret);

        req.userId = decoded.id;

        next();
    } catch (err) {
        return next(new AppError("Invalid or Expired token, Please Login Again", 401));
    }
};

module.exports = isAuthenticated;
