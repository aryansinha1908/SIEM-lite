const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const { corsConfig } = require("./config/cors");
const { errorHandler } = require("./middlewares/error.middleware.js");
const { AppError } = require("./utils/AppError.util.js");
const authRouter = require("./routes/auth.routes.js");
const eventRouter = require("./routes/event.route.js");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));

// Version 1 of API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRouter);

app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
})

app.use(errorHandler);

module.exports = app;
