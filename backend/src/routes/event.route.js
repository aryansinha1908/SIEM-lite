const express = require("express");
const eventController = require("../controllers/event.controller.js");
const validate = require("../middlewares/validate.middleware.js");
const { ingestEventSchema, getEvents } = require("../validators/event.validator.js");

const router = express.Router();

router.get(
    "/",
    eventController.getEvents
);

router.get(
    "/:id",
    eventController.getEvent
);

router.post(
    "/ingest", 
    validate(ingestEventSchema), 
    eventController.ingestEvent
);

module.exports = router;
