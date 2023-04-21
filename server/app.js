const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 4001;
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);
const io = socketIO(server, {
  cors: {
    origin: ['https://ridane.com', 'http://localhost:1234'],
    methods: ['GET', 'POST']
  }
});
let game = null;

io.on('connection', (socket) => {
  console.log('New client connected');

  // Player connects
  socket.on('id', (callback) => {
    callback({
      playerId: socket.id,
      gameId: game?.id
    });
  });

  // Player starts new game
  socket.on('new-game', ({ mapId }) => {
    console.log('New game created');

    const {
      name: mapName,
      players: playerStartPositions,
      enemies,
      items,
      animations,
      maps: mapTransitions,
      map: mapData
    } = require(`../game/data/maps/${mapId}.json`);

    game = {
      id: Math.random().toString(),
      mapId,
      mapName,
      mapData,
      mapTransitions: mapTransitions || [],
      playerStartPositions,
      items: items || [],
      animations: animations || [],
      enemies: enemies || [],
      players: []
    };
  });

  // Player joins a game
  socket.on('join-game', ({ player }, callback) => {
    console.log('Player joined game');

    game.players.push({
      ...player,
      pos: game.playerStartPositions[0]
    });

    callback(game);
  });

  // Player disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    if (game) {
      game.players = game.players.filter(({ id }) => id !== socket.id);

      // Reset game after last player left
      if (game.players.length <= 0) {
        game = null;
      }
    }

    io.sockets.emit('game-data', game);
  });
});
