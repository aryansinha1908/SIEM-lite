const logger = require("../config/logger.js");
const config = require("../config/env.js");

exports.errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!statusCode) statusCode = 500;
    if (!message) message = "Something went wrong";

    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`);

    const response = {
        success: false,
        statusCode,
        message,
        ...(config.NODE_ENV === "development" && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
}
