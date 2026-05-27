const dotenv = require("dotenv");
dotenv.config();

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
        refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
    }
};

module.exports = config;
