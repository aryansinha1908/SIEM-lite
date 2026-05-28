const { catchAsync } = require("../utils/catchAsync.util.js");
const authService = require("../services/auth.service.js");
const { cookieConfig } = require("../config/cookie.js");

exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const { user } = await authService.registerUser(username, email, password, role);

    user.password = undefined;

    res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        data: { user }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    res.cookie("accessToken", accessToken, cookieConfig.access);
    res.cookie("refreshToken", refreshToken, cookieConfig.refresh);

    res.status(200).json({
        success: true,
        message: "Logged in Successfully",
        data: { user }
    })
});

exports.logout = catchAsync(async (req, res, next) => {
    const { userId } = req.body;

    await authService.logoutUser(userId);

    res.clearCookie("accessToken", cookieConfig.clear);
    res.clearCookie("refreshToken", cookieConfig.clear);

    res.status(200).json({
        success: true,
        message: "Logged out Successfully",
    })
})
