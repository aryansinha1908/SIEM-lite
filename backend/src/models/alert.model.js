const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    alertId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["critical", "high", "medium", "low", "info"],
        required: true,
    },
    status: {
        type: String,
        enum: ["new", "investigating", "resolved", "closed"],
        default: "new"
    },
    ruleName: {
        type: String,
        required: true,
        index: true
    },
    entity: {
        type: String, 
        required: true
    },
    sourceEvents: [{
        type: String
    }]
}, { timestamps: true });

alertSchema.index({
    ruleName: 1,
    createdAt: -1,
});

module.exports = mongoose.model("Alert", alertSchema);
