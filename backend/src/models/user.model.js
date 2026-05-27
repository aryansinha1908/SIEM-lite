const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minlength: [3, "Name must be longer than 3 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    role: {
        type: String,
        enum: ["admin", "analyst"],
        default: "analyst"
    },
    status: {
        type: String,
        enum: ["active", "inactive", "locked"],
        default: "active"
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockedUntill: Date,
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    lastPasswordChange: Date,
    lastLoginIP: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
