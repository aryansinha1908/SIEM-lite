const crypto = require("crypto");
const Event = require("../models/event.model.js");
const { getIO } = require("../config/socket.js");

exports.getEvents = async (filters) => {

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.severity) query.severity = filters.severity;
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.actorIp) query["actor.ip"] = filters.actorIp;
    if (filters.userId) query["actor.userId"] = filters.userId;

    if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gt = filters.startDate;
        if (filters.endDate) query.timestamp.$lt = filters.endDate;
    }

    const [events, total] = await Promise.all([
        Event.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Event.countDocuments(query)
    ]);

    return {
        events,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

exports.getEvent = async (id) => {
    const event = await Event.findOne({ eventId: id }).lean();
    return event;
};

exports.ingestEvent = async (eventData) => {

    if (!eventData.eventId) {
        eventData.eventId = `evt_${crypto.randomUUID()}`;
    }

    const newEvent = await Event.create(eventData);

    getIO().emit("newEventIngested", newEvent);

    return newEvent;
};
