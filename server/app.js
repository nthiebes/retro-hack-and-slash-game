const express = require('express');
const socketIO = require('socket.io');
const { getRandomInt, getRandomId } = require('./utils/number.js');
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

    let chunks = generateChunks({
      chunks: [],
      newGame: true
    });
    let generatedMap;

    if (mapId === 'generated') {
      generatedMap = generateMap({
        chunks,
        centerChunkPos: [0, 0]
      });
      chunks = chunks.map((chunk) => ({
        ...chunk,
        map: {
          ...chunk.map,
          enemies: [],
          animations: [],
          events: []
        }
      }));
    } else {
      generatedMap = require(`../game/data/maps/${mapId}.json`);
    }

    const {
      name: mapName,
      playerStartPositions,
      enemies,
      events,
      animations,
      mapTransitions,
      map
    } = generatedMap;

    game = {
      id: getRandomId(),
      mapId,
      mapName,
      map,
      mapTransitions,
      playerStartPositions,
      events,
      animations,
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
      game.events = game.events.map((event) => ({
        ...event,
        pos: [event.pos[0] - 30, event.pos[1]]
      }));
      game.animations = game.animations.map((animation) => ({
        ...animation,
        pos: [animation.pos[0] - 30, animation.pos[1]]
      }));
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
      game.events = game.events.map((event) => ({
        ...event,
        pos: [event.pos[0] + 30, event.pos[1]]
      }));
      game.animations = game.animations.map((animation) => ({
        ...animation,
        pos: [animation.pos[0] + 30, animation.pos[1]]
      }));
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
      game.events = game.events.map((event) => ({
        ...event,
        pos: [event.pos[0], event.pos[1] - 30]
      }));
      game.animations = game.animations.map((animation) => ({
        ...animation,
        pos: [animation.pos[0], animation.pos[1] - 30]
      }));
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
      game.events = game.events.map((event) => ({
        ...event,
        pos: [event.pos[0], event.pos[1] + 30]
      }));
      game.animations = game.animations.map((animation) => ({
        ...animation,
        pos: [animation.pos[0], animation.pos[1] + 30]
      }));
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
      events: [...game.events, ...events],
      animations: [...game.animations, ...animations],
      enemies: [...game.enemies, ...enemies],
      map,
      playerStartPositions
    };

    game.chunks = game.chunks.map((chunk) => ({
      ...chunk,
      map: {
        ...chunk.map,
        enemies: [],
        animations: [],
        events: []
      }
    }));

    io.sockets.emit('map-data', {
      mapData: {
        map,
        events: game.events,
        animations: game.animations,
        enemies: game.enemies
      },
      direction
    });
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

  /*
   * Player equips item
   */
  socket.on('equip', ({ item }) => {
    // console.log('Player equips item');

    game.events = game.events.filter(({ id }) => item.id !== id);

    io.sockets.emit('player-equipped', { item, playerId });
  });

  /**
   * Remove event
   */
  socket.on('remove-event', ({ eventId, animationId }) => {
    game.events = game.events.filter(({ id }) => eventId !== id);

    if (animationId) {
      game.animations = game.animations.map((animation) =>
        animation.id === animationId
          ? {
              ...animation,
              played: true
            }
          : animation
      );
    }
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
