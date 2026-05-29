const { catchAsync } = require("../utils/catchAsync.util");
const eventService = require("../services/event.service.js");

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
