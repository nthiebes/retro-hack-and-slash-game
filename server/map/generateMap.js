const { config } = require('../config.js');
const { chunkSize } = config;

const generateMap = ({ chunks, centerChunkPos }) => {
  const centerChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] && chunk.pos[1] === centerChunkPos[1]
  ).map;
  const topChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] &&
      chunk.pos[1] === centerChunkPos[1] - 1
  ).map;
  const topRightChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] + 1 &&
      chunk.pos[1] === centerChunkPos[1] - 1
  ).map;
  const rightChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] + 1 &&
      chunk.pos[1] === centerChunkPos[1]
  ).map;
  const bottomRightChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] + 1 &&
      chunk.pos[1] === centerChunkPos[1] + 1
  ).map;
  const bottomChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] &&
      chunk.pos[1] === centerChunkPos[1] + 1
  ).map;
  const bottomLeftChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] - 1 &&
      chunk.pos[1] === centerChunkPos[1] + 1
  ).map;
  const leftChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] - 1 &&
      chunk.pos[1] === centerChunkPos[1]
  ).map;
  const topLeftChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === centerChunkPos[0] - 1 &&
      chunk.pos[1] === centerChunkPos[1] - 1
  ).map;

  // Ground 1
  let topChunksGround1 = topLeftChunk.mapGround1;
  let centerChunksGround1 = leftChunk.mapGround1;
  let bottomChunksGround1 = bottomLeftChunk.mapGround1;

  topChunksGround1 = topChunksGround1.map((row, index) => [
    ...row,
    ...topChunk.mapGround1[index],
    ...topRightChunk.mapGround1[index]
  ]);
  centerChunksGround1 = centerChunksGround1.map((row, index) => [
    ...row,
    ...centerChunk.mapGround1[index],
    ...rightChunk.mapGround1[index]
  ]);
  bottomChunksGround1 = bottomChunksGround1.map((row, index) => [
    ...row,
    ...bottomChunk.mapGround1[index],
    ...bottomRightChunk.mapGround1[index]
  ]);

  const mapGround1 = [
    ...topChunksGround1,
    ...centerChunksGround1,
    ...bottomChunksGround1
  ];

  // Ground 2
  let topChunksGround2 = topLeftChunk.mapGround2;
  let centerChunksGround2 = leftChunk.mapGround2;
  let bottomChunksGround2 = bottomLeftChunk.mapGround2;

  topChunksGround2 = topChunksGround2.map((row, index) => [
    ...row,
    ...topChunk.mapGround2[index],
    ...topRightChunk.mapGround2[index]
  ]);
  centerChunksGround2 = centerChunksGround2.map((row, index) => [
    ...row,
    ...centerChunk.mapGround2[index],
    ...rightChunk.mapGround2[index]
  ]);
  bottomChunksGround2 = bottomChunksGround2.map((row, index) => [
    ...row,
    ...bottomChunk.mapGround2[index],
    ...bottomRightChunk.mapGround2[index]
  ]);

  const mapGround2 = [
    ...topChunksGround2,
    ...centerChunksGround2,
    ...bottomChunksGround2
  ];

  // Top 1
  let topChunksTop1 = topLeftChunk.mapTop1;
  let centerChunksTop1 = leftChunk.mapTop1;
  let bottomChunksTop1 = bottomLeftChunk.mapTop1;

  topChunksTop1 = topChunksTop1.map((row, index) => [
    ...row,
    ...topChunk.mapTop1[index],
    ...topRightChunk.mapTop1[index]
  ]);
  centerChunksTop1 = centerChunksTop1.map((row, index) => [
    ...row,
    ...centerChunk.mapTop1[index],
    ...rightChunk.mapTop1[index]
  ]);
  bottomChunksTop1 = bottomChunksTop1.map((row, index) => [
    ...row,
    ...bottomChunk.mapTop1[index],
    ...bottomRightChunk.mapTop1[index]
  ]);

  const mapTop1 = [...topChunksTop1, ...centerChunksTop1, ...bottomChunksTop1];

  // Blocked
  let topChunksBlocked = topLeftChunk.mapBlocked;
  let centerChunksBlocked = leftChunk.mapBlocked;
  let bottomChunksBlocked = bottomLeftChunk.mapBlocked;

  topChunksBlocked = topChunksBlocked.map((row, index) => [
    ...row,
    ...topChunk.mapBlocked[index],
    ...topRightChunk.mapBlocked[index]
  ]);
  centerChunksBlocked = centerChunksBlocked.map((row, index) => [
    ...row,
    ...centerChunk.mapBlocked[index],
    ...rightChunk.mapBlocked[index]
  ]);
  bottomChunksBlocked = bottomChunksBlocked.map((row, index) => [
    ...row,
    ...bottomChunk.mapBlocked[index],
    ...bottomRightChunk.mapBlocked[index]
  ]);

  const mapBlocked = [
    ...topChunksBlocked,
    ...centerChunksBlocked,
    ...bottomChunksBlocked
  ];

  // Offset events
  let centerChunkEvents,
    topChunkEvents,
    topRightChunkEvents,
    rightChunkEvents,
    bottomRightChunkEvents,
    bottomChunkEvents,
    bottomLeftChunkEvents,
    leftChunkEvents,
    topLeftChunkEvents;

  if (centerChunk.events) {
    centerChunkEvents = centerChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + chunkSize, event.pos[1] + chunkSize],
      chunk: centerChunk.pos
    }));
  }
  if (topChunk.events) {
    topChunkEvents = topChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + chunkSize, event.pos[1] + 0],
      chunk: topChunk.pos
    }));
  }
  if (topRightChunk.events) {
    topRightChunkEvents = topRightChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + chunkSize * 2, event.pos[1] + 0],
      chunk: topRightChunk.pos
    }));
  }
  if (rightChunk.events) {
    rightChunkEvents = rightChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + chunkSize * 2, event.pos[1] + chunkSize],
      chunk: rightChunk.pos
    }));
  }
  if (bottomRightChunk.events) {
    bottomRightChunkEvents = bottomRightChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + chunkSize * 2, event.pos[1] + chunkSize * 2],
      chunk: bottomRightChunk.pos
    }));
  }
  if (bottomChunk.events) {
    bottomChunkEvents = bottomChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + chunkSize, event.pos[1] + chunkSize * 2],
      chunk: bottomChunk.pos
    }));
  }
  if (bottomLeftChunk.events) {
    bottomLeftChunkEvents = bottomLeftChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + 0, event.pos[1] + chunkSize * 2],
      chunk: bottomLeftChunk.pos
    }));
  }
  if (leftChunk.events) {
    leftChunkEvents = leftChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + 0, event.pos[1] + chunkSize],
      chunk: leftChunk.pos
    }));
  }
  if (topLeftChunk.events) {
    topLeftChunkEvents = topLeftChunk.events.map((event) => ({
      ...event,
      pos: [event.pos[0] + 0, event.pos[1] + 0],
      chunk: topLeftChunk.pos
    }));
  }

  // Offset animations
  let centerChunkAnimations,
    topChunkAnimations,
    topRightChunkAnimations,
    rightChunkAnimations,
    bottomRightChunkAnimations,
    bottomChunkAnimations,
    bottomLeftChunkAnimations,
    leftChunkAnimations,
    topLeftChunkAnimations;

  if (centerChunk.animations) {
    centerChunkAnimations = centerChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + chunkSize, animation.pos[1] + chunkSize]
    }));
  }
  if (topChunk.animations) {
    topChunkAnimations = topChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + chunkSize, animation.pos[1] + 0]
    }));
  }
  if (topRightChunk.animations) {
    topRightChunkAnimations = topRightChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + chunkSize * 2, animation.pos[1] + 0]
    }));
  }
  if (rightChunk.animations) {
    rightChunkAnimations = rightChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + chunkSize * 2, animation.pos[1] + chunkSize]
    }));
  }
  if (bottomRightChunk.animations) {
    bottomRightChunkAnimations = bottomRightChunk.animations.map(
      (animation) => ({
        ...animation,
        pos: [
          animation.pos[0] + chunkSize * 2,
          animation.pos[1] + chunkSize * 2
        ]
      })
    );
  }
  if (bottomChunk.animations) {
    bottomChunkAnimations = bottomChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + chunkSize, animation.pos[1] + chunkSize * 2]
    }));
  }
  if (bottomLeftChunk.animations) {
    bottomLeftChunkAnimations = bottomLeftChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + 0, animation.pos[1] + chunkSize * 2]
    }));
  }
  if (leftChunk.animations) {
    leftChunkAnimations = leftChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + 0, animation.pos[1] + chunkSize]
    }));
  }
  if (topLeftChunk.animations) {
    topLeftChunkAnimations = topLeftChunk.animations.map((animation) => ({
      ...animation,
      pos: [animation.pos[0] + 0, animation.pos[1] + 0]
    }));
  }

  // Offset enemies
  let centerChunkEnemies,
    topChunkEnemies,
    topRightChunkEnemies,
    rightChunkEnemies,
    bottomRightChunkEnemies,
    bottomChunkEnemies,
    bottomLeftChunkEnemies,
    leftChunkEnemies,
    topLeftChunkEnemies;

  if (centerChunk.enemies) {
    centerChunkEnemies = centerChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + chunkSize, enemy.pos[1] + chunkSize]
    }));
  }
  if (topChunk.enemies) {
    topChunkEnemies = topChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + chunkSize, enemy.pos[1] + 0]
    }));
  }
  if (topRightChunk.enemies) {
    topRightChunkEnemies = topRightChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + chunkSize * 2, enemy.pos[1] + 0]
    }));
  }
  if (rightChunk.enemies) {
    rightChunkEnemies = rightChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + chunkSize * 2, enemy.pos[1] + chunkSize]
    }));
  }
  if (bottomRightChunk.enemies) {
    bottomRightChunkEnemies = bottomRightChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + chunkSize * 2, enemy.pos[1] + chunkSize * 2]
    }));
  }
  if (bottomChunk.enemies) {
    bottomChunkEnemies = bottomChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + chunkSize, enemy.pos[1] + chunkSize * 2]
    }));
  }
  if (bottomLeftChunk.enemies) {
    bottomLeftChunkEnemies = bottomLeftChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + 0, enemy.pos[1] + chunkSize * 2]
    }));
  }
  if (leftChunk.enemies) {
    leftChunkEnemies = leftChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + 0, enemy.pos[1] + chunkSize]
    }));
  }
  if (topLeftChunk.enemies) {
    topLeftChunkEnemies = topLeftChunk.enemies.map((enemy) => ({
      ...enemy,
      pos: [enemy.pos[0] + 0, enemy.pos[1] + 0]
    }));
  }

  const playerPosition = Math.round((chunkSize * 3) / 2);

  return {
    playerStartPositions: [[playerPosition, playerPosition]],
    enemies: [
      ...centerChunkEnemies,
      ...topChunkEnemies,
      ...topRightChunkEnemies,
      ...rightChunkEnemies,
      ...bottomRightChunkEnemies,
      ...bottomChunkEnemies,
      ...bottomLeftChunkEnemies,
      ...leftChunkEnemies,
      ...topLeftChunkEnemies
    ],
    events: [
      ...centerChunkEvents,
      ...topChunkEvents,
      ...topRightChunkEvents,
      ...rightChunkEvents,
      ...bottomRightChunkEvents,
      ...bottomChunkEvents,
      ...bottomLeftChunkEvents,
      ...leftChunkEvents,
      ...topLeftChunkEvents
    ],
    animations: [
      ...centerChunkAnimations,
      ...topChunkAnimations,
      ...topRightChunkAnimations,
      ...rightChunkAnimations,
      ...bottomRightChunkAnimations,
      ...bottomChunkAnimations,
      ...bottomLeftChunkAnimations,
      ...leftChunkAnimations,
      ...topLeftChunkAnimations
    ],
    mapTransitions: [],
    map: [mapGround1, mapGround2, mapTop1, mapBlocked]
  };
};

exports.generateMap = generateMap;
