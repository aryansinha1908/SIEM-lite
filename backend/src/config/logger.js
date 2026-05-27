const winston = require("winston");
const config = require("./env.js");

const logger = winston.createLogger({
    level: config.NODE_ENV === "development" ? "debug" : "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

if (config.NODE_ENV !== "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
