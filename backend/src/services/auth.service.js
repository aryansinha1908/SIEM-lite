const AppError = require("../utils/AppError.util.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const token = require("../utils/token.util.js");

exports.registerUser = async (username, email, password, role) => {

    const exists = await User.findOne({ email });
    if (exists) {
        throw new AppError("User Could Not be Created", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username: username,
        email: email,
        password: passwordHash,
        role: role,
    });

    if (!user) {
        throw new AppError("User Could Not be Created")
    }

    return { user };
}

exports.loginUser = async (email, password) => {

    const user = await User.findOne({ email }).select('password');

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword){
        throw new AppError("Invalid email or password", 401);
    }

    const tokens = token.generateAuthTokens(user._id, user.role);

    return {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    };
}

exports.logoutUser = async (userId) => {

    await User.findByIdAndUpdate(userId, {
        $set: { refreshToken: null }
    });

    return;
}
