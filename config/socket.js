const {Server} = require('socket.io');

const setupSocket =(server) => {
    const io = new server( server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }   
    });

    require('../sockets/noteSocket')(io);
    return io;
};

module.exports = setupSocket;