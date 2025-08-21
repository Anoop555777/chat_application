const socketIO = require('socket.io');
let io;

function initSocket(server) {
  const { Server } = socketIO;
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
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
