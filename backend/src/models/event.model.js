const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        required: true,
    },
    receivedAt: {
        type: Date,
        default: Date.now
    },
    source: {
        system: {
            type: String,
            required: true
        },
        ip: String,
        hostname: String,
        application: String
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            "AUTH_FAILURE",
            "AUTH_SUCCESS",
            "PASSWORD_RESET_REQUEST",
            "PASSWORD_RESET_SUCCESS",
            "ADMIN_LOGIN",
            "SUSPICIOUS_API_CALL",
            "RATE_LIMIT_EXCEEDED",
            "TOKEN_VALIDATION_FAILURE",
            "DATA_EXPORT",
            "CONFIGURATION_CHANGE",
            "USER_CREATED",
            "USER_DELETED",
            "CUSTOM"
        ]
    },
    severity: {
        type: String,
        enum: [
            "critical",
            "high",
            "medium",
            "low",
            "info"
        ],
        required: true,
    },
    category: {
        type: String,
        enum: [
            "authentication",
            "authorization",
            "network",
            "application",
            "system",
            "data",
            "compliance"
        ]
    },
    actor: {
        userId: String,
        username: String,
        email: String,
        ip: String,
        userAgent: String,
        sessionId: String
    },
    target: {
        resourceType: String,
        id: String,
        name: String
    },
    action: {
        type: String,
        required: true,
    },
    outcome: {
        type: String,
        enum: [
            "success",
            "failure",
            "unknown"
        ],
        default: "unknown"
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    rawData: {
        type: mongoose.Schema.Types.Mixed
    },
    tags: [{
        type: String,
    }],
    relatedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    processed: {
        type: Boolean,
        default: false
    },
    matchedRules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rule"
    }],
    metadata: {
        version: String,
        schema: String
    }
});

eventSchema.index({ timestamp: -1 });
eventSchema.index({ eventType: 1, severity: 1 });
eventSchema.index({ "source.ip": 1, timestamp: -1 });

module.exports = mongoose.model("Event", eventSchema);
