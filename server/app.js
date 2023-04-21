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

  let playerId = null;

  /**
   * Player connects
   */
  socket.on('id', (callback) => {
    playerId = `player.${socket.id}`;

    callback({
      playerId: playerId,
      gameId: game?.id
    });
  });

  /**
   * Player starts new game
   */
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

  /**
   * Player joins a game
   */
  socket.on('join-game', ({ player }, callback) => {
    console.log('Player joined game');

    const newPlayer = {
      ...player,
      pos: game.playerStartPositions[0]
    };

    game.players.push(newPlayer);

    callback(game);
    io.sockets.emit('player-joined', { newPlayer });
  });

  /**
   * Player moves
   */
  socket.on('move', ({ path }) => {
    console.log('Player moves');

    game.players.forEach((player) => {
      if (player.id === playerId) {
        player.pos = path[0];
        player.path = path;
      }
    });

    io.sockets.emit('player-moved', { path, playerId });
  });

  /**
   * Player turns
   */
  socket.on('turn', ({ direction }) => {
    console.log('Player turns');

    game.players.forEach((player) => {
      if (player.id === playerId) {
        player.direction = direction;
      }
    });

    io.sockets.emit('player-turned', { direction, playerId });
  });

  /**
   * Player attacks
   */
  socket.on('attack', () => {
    console.log('Player attacks');

    io.sockets.emit('player-attacked', { playerId });
  });

  /**
   * Player stopps attacking
   */
  socket.on('player-stop-attack', () => {
    console.log('Player stopps attacking');

    io.sockets.emit('player-stopped-attack', { playerId });
  });

  /**
   * Player equips item
   */
  socket.on('equip', ({ item }) => {
    console.log('Player equips item');

    io.sockets.emit('player-equipped', { item, playerId });
  });

  /**
   * Player disconnects
   */
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    if (game) {
      game.players = game.players.filter(({ id }) => id !== playerId);

      // Reset game after last player left
      if (game.players.length <= 0) {
        console.log('Game reset');

        game = null;
      }
    }

    io.sockets.emit('player-left', { playerId });
  });
});
