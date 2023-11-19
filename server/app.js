const express = require('express');
const socketIO = require('socket.io');
const { getRandomInt } = require('./utils/number.js');
const { generateMap } = require('./map/generateMap.js');
const { generateChunks } = require('./map/generateChunks.js');
// const { config } = require('./config.js');
// const { chunkSize } = config;
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

    const chunks = generateChunks({
      chunks: [],
      newGame: true
    });
    let map;

    if (mapId === 'generated') {
      map = generateMap({
        chunks,
        centerChunkPos: [0, 0]
      });
    } else {
      map = require(`../game/data/maps/${mapId}.json`);
    }

    const {
      name: mapName,
      players: playerStartPositions,
      enemies,
      items,
      animations,
      maps: mapTransitions,
      map: mapData
    } = map;

    game = {
      id: Math.random().toString(),
      mapId,
      mapName,
      mapData,
      mapTransitions: mapTransitions || [],
      playerStartPositions,
      items: items
        ? items.map((item) => ({
            ...item,
            id: `${item.id}.${Math.random().toString()}`
          }))
        : [],
      animations: animations || [],
      enemies: enemies
        ? enemies.map((enemy) => ({
            ...enemy,
            direction: getRandomInt(2) === 1 ? 'LEFT' : 'RIGHT'
          }))
        : [],
      players: [],
      chunks
    };
  });

  /**
   * Player joins a game
   */
  socket.on('join-game', ({ player }, callback) => {
    console.log('Player joined game');

    const newPlayer = {
      ...player,
      pos: game.playerStartPositions[0],
      chunk: [0, 0]
    };

    game.players.push(newPlayer);

    callback(game);
    io.sockets.emit('player-joined', { newPlayer });
  });

  /**
   * Player moves
   */
  socket.on('move', ({ pos }) => {
    const player = game.players.find(({ id }) => id === playerId);

    player.pos = pos;

    io.sockets.emit('player-moved', { pos, playerId });
  });

  /**
   * Player moves to new chunk
   */
  socket.on('new-chunk', ({ direction }) => {
    const player = game.players.find(({ id }) => id === playerId);
    let centerChunk;

    if (direction === 'right') {
      centerChunk = game.chunks.find(
        (chunk) =>
          chunk.pos[0] === player.chunk[0] + 1 &&
          chunk.pos[1] === player.chunk[1]
      );

      game.chunks = generateChunks({
        chunks: game.chunks,
        centerChunk
      });
    } else if (direction === 'left') {
      centerChunk = game.chunks.find(
        (chunk) =>
          chunk.pos[0] === player.chunk[0] - 1 &&
          chunk.pos[1] === player.chunk[1]
      );

      game.chunks = generateChunks({
        chunks: game.chunks,
        centerChunk
      });
    } else if (direction === 'bottom') {
      centerChunk = game.chunks.find(
        (chunk) =>
          chunk.pos[0] === player.chunk[0] &&
          chunk.pos[1] === player.chunk[1] + 1
      );

      game.chunks = generateChunks({
        chunks: game.chunks,
        centerChunk
      });
    } else if (direction === 'top') {
      centerChunk = game.chunks.find(
        (chunk) =>
          chunk.pos[0] === player.chunk[0] &&
          chunk.pos[1] === player.chunk[1] - 1
      );

      game.chunks = generateChunks({
        chunks: game.chunks,
        centerChunk
      });
    }

    const mapData = generateMap({
      chunks: game.chunks,
      centerChunkPos: centerChunk.pos
    });

    player.chunk = centerChunk.pos;

    io.sockets.emit('map-data', { mapData, direction });
  });

  /**
   * Player turns
   */
  socket.on('turn', ({ direction }) => {
    // console.log('Player turns');

    game.players.find((player) => player.id === playerId).direction = direction;

    io.sockets.emit('player-turned', { direction, playerId });
  });

  /**
   * Player attacks
   */
  socket.on('attack', () => {
    // console.log('Player attacks');

    io.sockets.emit('player-attacked', { playerId });
  });

  /**
   * Player stopps attacking
   */
  socket.on('player-stop-attack', () => {
    // console.log('Player stopps attacking');

    io.sockets.emit('player-stopped-attack', { playerId });
  });

  /**
   * Player equips item
   */
  socket.on('equip', ({ item }) => {
    // console.log('Player equips item');

    game.items = game.items.filter(({ id }) => item.id !== id);

    io.sockets.emit('player-equipped', { item, playerId });
  });

  /**
   * AI moves
   */
  socket.on('ai-move', ({ path, id }) => {
    // console.log('AI moves');

    game.enemies.forEach((enemy) => {
      if (enemy.id === id) {
        enemy.path = path;
      }
    });

    io.sockets.emit('ai-moved', { path, id });
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
