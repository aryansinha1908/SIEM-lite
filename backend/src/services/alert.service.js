const Alert = require("../models/alert.model.js");
const crypto = require("crypto");

exports.getAlertById = async (alertId) => {
    return await Alert.findOne({ alertId }).lean();
};

exports.createAlert = async (alertData) => {
    const newAlert = new Alert({
        alertId: `evt_${crypto.randomUUID()}`,
        ...alertData
    });
    
    await newAlert.save();
    return newAlert;
};

exports.getAlerts = async (filters) => {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.severity) query.severity = filters.severity;
    if (filters.status) query.status = filters.status;
    if (filters.entity) query.entity = filters.entity;

    const [alerts, total] = await Promise.all([
        Alert.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
        Alert.countDocuments(query).exec()
    ]);

    return {
        alerts,
        meta: { 
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

exports.updateAlert = async (alertId, updateData) => {
    const updatedAlert = await Alert.findOneAndUpdate(
        { alertId: alertId },
        { $set: updateData },
        { new: true, runValidators: true } 
    ).lean();

    return updatedAlert;
};
