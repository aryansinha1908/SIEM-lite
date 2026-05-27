const config = require("./env.js");

const baseConfig = {
    httpOnly: true,
    secure: config.NODE_ENV === "development",
    sameSite:"strict",
    path: "/",
};

exports.cookieConfig = {
    access: {
        ...baseConfig,
        maxAge: 1000 * 60 * 15
    },
    refresh: {
        ...baseConfig,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },

    clear: baseConfig
}

