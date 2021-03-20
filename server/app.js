const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 4001;
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);
const io = socketIO(server, {
  cors: {
    origin: ['https://ridane.com', 'http://localhost:1337'],
    methods: ['GET', 'POST']
  }
});
let game = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  // Player connects
  socket.on('id', (callback) => {
    callback(socket.id);
  });

  // Get game
  socket.on('game', (callback) => {
    callback(game);
  });

  // Start new game
  socket.on('new', ({ map }) => {
    game = {
      map
    };
  });

  // Player disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
