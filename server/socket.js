const { Server } = require('socket.io'); // correct way
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinChannel', (channelId) => {
      socket.join(channelId);
      console.log(`User joined channel ${channelId}`);
    });

    socket.on('leaveChannel', (channelId) => {
      socket.leave(channelId);
      console.log(`User left channel ${channelId}`);
    });
  });
}

function getSocket() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }

  return io;
}

module.exports = { initSocket, getSocket };
