const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate.middleware.js");
const authController = require("../controllers/auth.controller.js");
const authSchema =  require("../validators/auth.validator.js");

router.post("/login", validate(authSchema.loginSchema), authController.login);
router.post("/register", validate(authSchema.registerSchema), authController.register);
router.post("/logout", validate(authSchema.logoutSchema), authController.logout);

module.exports = router;
