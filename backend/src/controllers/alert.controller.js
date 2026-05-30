const alertService = require("../services/alert.service.js");
const AppError = require("../utils/AppError.util.js");
const { catchAsync } = require("../utils/catchAsync.util.js");

exports.createAlert = catchAsync(async (req, res, next) => {
    const alert = await alertService.createAlert(req.body);
    res.status(201).json({
        success: true,
        message: "Alert created successfully",
        data: alert
    });
});

exports.getAlerts = catchAsync(async (req, res, next) => {
    const result = await alertService.getAlerts(req.query);
    res.status(200).json({
        success: true,
        data: result.alerts,
        meta: result.meta
    });
});

exports.getAlertById = catchAsync(async (req, res, next) => {
    const alert = await alertService.getAlertById(req.params.id);
    if (!alert) {
        return next(new AppError("Alert not found", 404));
    }
    res.status(200).json({
        success: true,
        data: alert
    });
});

exports.updateAlert = catchAsync(async (req, res, next) => {
    const alert = await alertService.updateAlert(req.params.id, req.body);
    
    if (!alert) {
        return next(new AppError("Alert not found", 404));
    }
    
    res.status(200).json({
        success: true,
        message: "Alert updated successfully",
        data: alert
    });
});
