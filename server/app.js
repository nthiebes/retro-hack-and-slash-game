const express = require('express');
const socketIO = require('socket.io');
const { getRandomId } = require('./utils/number.js');
const { generateMap } = require('./map/generateMap.js');
const { generateChunks } = require('./map/generateChunks.js');
const { config } = require('./config.js');
const PORT = process.env.PORT || 4001;
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);
const io = socketIO(server, {
  cors: {
    origin: [
      'https://ridane.com',
      'http://localhost:1234',
      'http://192.168.2.69:1234'
    ],
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
    let generatedMap;

    if (mapId === 'generated') {
      generatedMap = generateMap({
        chunks,
        centerChunkPos: [0, 0]
      });
    } else {
      generatedMap = require(`../game/data/maps/${mapId}.json`);
    }

    const { name: mapName, playerStartPositions } = generatedMap;

    game = {
      id: getRandomId(),
      playerStartPositions,
      mapId,
      mapName,
      players: [],
      chunks
    };

    io.sockets.emit('game-started');
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
    const generatedMap = generateMap({
      chunks: game.chunks,
      centerChunkPos: [0, 0]
    });
    const { events, animations, enemies, mapTransitions, map } = generatedMap;

    game.players.push(newPlayer);

    callback({
      ...game,
      mapTransitions,
      map,
      events,
      animations,
      enemies,
      chunk: player.chunk,
      playerId
    });
    socket.broadcast.emit('player-joined', { newPlayer });
  });

  /**
   * Player moves
   */
  socket.on('move', ({ pos }) => {
    const player = game.players.find(({ id }) => id === playerId);

    player.pos = pos;
    player.tile = [Math.floor(pos[0]), Math.floor(pos[1])];

    socket.broadcast.emit('player-moved', { pos, playerId });
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

    const generatedMap = generateMap({
      chunks: game.chunks,
      centerChunkPos: centerChunk.pos
    });
    const {
      events,
      animations,
      mapTransitions,
      map,
      enemies,
      playerStartPositions
    } = generatedMap;

    player.chunk = centerChunk.pos;

    game = {
      ...game,
      mapTransitions,
      playerStartPositions
    };

    io.sockets.emit('map-data', {
      mapData: {
        map,
        events,
        animations,
        enemies
      },
      direction,
      chunk: player.chunk,
      playerId
    });

    if (config.debug) {
      console.log(process.memoryUsage());
    }
  });

  /**
   * Player turns
   */
  socket.on('turn', ({ direction }) => {
    // console.log('Player turns');

    game.players.find((player) => player.id === playerId).direction = direction;

    socket.broadcast.emit('player-turned', { direction, playerId });
  });

  /**
   * Player attacks
   */
  socket.on('attack', () => {
    // console.log('Player attacks');

    socket.broadcast.emit('player-attacked', { playerId });
  });

  /**
   * Player stopps attacking
   */
  socket.on('player-stop-attack', () => {
    // console.log('Player stopps attacking');

    socket.broadcast.emit('player-stopped-attack', { playerId });
  });

  /*
   * Player takes item
   */
  socket.on('take-item', ({ item, animationId }) => {
    // console.log('Player takes item');

    socket.broadcast.emit('player-took-item', { item, animationId, playerId });
  });

  /**
   * Remove event
   */
  socket.on('remove-event', ({ eventId, animationId, chunkPos }) => {
    game.chunks = game.chunks.map((chunk) => {
      if (chunk.pos[0] === chunkPos[0] && chunk.pos[1] === chunkPos[1]) {
        let chunkAnimations = chunk.map.animations;

        if (animationId) {
          chunkAnimations = chunkAnimations.map((animation) =>
            animation.id === animationId
              ? {
                  ...animation,
                  played: true
                }
              : animation
          );
        }

        return {
          ...chunk,
          map: {
            ...chunk.map,
            events: chunk.map.events.filter(({ id }) => eventId !== id),
            animations: chunkAnimations
          }
        };
      }
      return chunk;
    });
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

    socket.broadcast.emit('ai-moved', { path, id });
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

        io.sockets.emit('game-over');
      }
    }

    socket.broadcast.emit('player-left', { playerId });
  });
});
