require("dotenv").config();

const app = require("./app.js");
const connectToDB = require("./config/db.js");
const logger = require("./config/logger.js");
const config = require("./config/env.js");
const { init } = require("./config/socket.js");

process.on('uncaughtException', (err) => {
    logger.error("UNCAUGHT EXCEPTION Shutting Down...");
    logger.error(`${err.name}: ${err.message}`);
    process.exit(1);
});

connectToDB();

const server = app.listen(config.PORT, () => {
    logger.info(`The server is running on port: ${config.PORT}`);
});

const io = init(server);

io.on("connection", (socket) => {
    logger.info(`WebSocket Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        logger.info(`Websocket Client disconnected: ${socket.id}`);
    });
})

process.on('unhandledRejection', (err) => {
    logger.error("UNHANDLED REJECTION Shutting Down...");
    logger.error(`${err.name}: ${err.message}`);

    server.close(() => {
        process.exit(1);
    })
});
