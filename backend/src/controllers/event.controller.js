const AppError = require("../utils/AppError.util.js");
const { catchAsync } = require("../utils/catchAsync.util");
const eventService = require("../services/event.service.js");

exports.getEvents = catchAsync(async (req, res, next) => {
    const result = await eventService.getEvents(req.query);

    res.status(200).json({
        success: true,
        message: "Events Found",
        data: result.events,
        meta: result.meta
    });
});

exports.getEvent = catchAsync (async (req, res, next) => {
    const result = await eventService.getEvent(req.params.id);

    if (!result) {
        return next(new AppError("Event Not Found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Event Found",
        data: result
    })
});

exports.ingestEvent = catchAsync(async (req, res, next) => {
    const event = await eventService.ingestEvent(req.body);

    res.status(201).json({
        success: true,
        message: "Event ingested Successfully",
        data: {
            eventId: event.eventId
        }
    });
});
