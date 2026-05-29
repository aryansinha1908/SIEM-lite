const crypto = require("crypto");
const Event = require("../models/event.model.js");

exports.ingestEvent = async (eventData) => {

    if (!eventData.eventId) {
        eventData.eventId = `evt_${crypto.randomUUID()}`;
    }

    const newEvent = await Event.create(eventData);

    return newEvent;
};
