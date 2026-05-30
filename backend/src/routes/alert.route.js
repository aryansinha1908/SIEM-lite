const express = require("express");
const alertController = require("../controllers/alert.controller.js");
const validate = require("../middlewares/validate.middleware.js");
const { createAlertSchema, updateAlertSchema } = require("../validators/alert.validator.js");

const router = express.Router();

router.get("/", alertController.getAlerts);
router.get("/:id", alertController.getAlertById);
router.post("/", validate(createAlertSchema), alertController.createAlert);
router.patch("/:id", validate(updateAlertSchema), alertController.updateAlert);

module.exports = router;
