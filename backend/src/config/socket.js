const { Server } = require('socket.io');
const { corsConfig } = require('./cors.js');

let io;

module.exports = {
    init: (httpserver) => {
        io = new Server(httpserver, {
            cors: corsConfig
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io has not been initialised");
        }
        return io;
    }
};
