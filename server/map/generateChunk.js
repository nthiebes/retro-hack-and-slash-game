const { blocks } = require('./data/blocks.js');
const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { chunkSize } = config;

const getRandomPositions = (max) => {
  const count = max || chunkSize;
  const randomPositions = [];

  for (let i = 0; i < count; i++) {
    randomPositions.push([getRandomInt(chunkSize), getRandomInt(chunkSize)]);
  }

  return randomPositions;
};

const generateChunk = ({ biome, offset }) => {
  const mapGround2 = new Array(chunkSize)
    .fill(0)
    .map(() => new Array(chunkSize).fill(0));
  const mapTop1 = new Array(chunkSize)
    .fill(0)
    .map(() => new Array(chunkSize).fill(0));
  const mapBlocked = new Array(chunkSize)
    .fill(0)
    .map(() => new Array(chunkSize).fill(0));
  let mapGround1;
  const animations = [];
  const items = [];
  const enemies = [];

  if (biome.ground === 32) {
    mapGround1 = new Array(chunkSize).fill(0).map((_, index) => {
      const innerGround1 = new Array(chunkSize).fill(0);

      if (index % 2) {
        return innerGround1.map((__, innerIndex) =>
          innerIndex % 2 ? 143 : 142
        );
      }

      return innerGround1.map((__, innerIndex) => (innerIndex % 2 ? 127 : 126));
    });
  } else {
    mapGround1 = new Array(chunkSize)
      .fill(0)
      .map(() => new Array(chunkSize).fill(biome.ground));
  }

  // Blocks
  biome.blocks.forEach((block) => {
    getRandomPositions(block.amount).forEach((pos) => {
      const randomX = pos[0];
      const randomY = pos[1];
      let tileOccupied = false;

      // Check for occupied tiles
      blocks[block.id].map.forEach((mapLayer, mapLayerIndex) => {
        mapLayer.forEach((tiles, x) => {
          tiles.forEach((value, y) => {
            const inChunkBorder =
              x + randomX < chunkSize && y + randomY < chunkSize;

            // Ground 2
            if (
              mapLayerIndex === 1 &&
              value &&
              inChunkBorder &&
              mapGround2[x + randomX][y + randomY] > 0
            ) {
              tileOccupied = true;
            }
            // Top 1
            if (
              mapLayerIndex === 2 &&
              value &&
              inChunkBorder &&
              mapTop1[x + randomX][y + randomY] > 0
            ) {
              tileOccupied = true;
            }

            if (!inChunkBorder) {
              tileOccupied = true;
            }
          });
        });
      });

      // Place block
      if (!tileOccupied) {
        blocks[block.id].map.forEach((mapLayer, mapLayerIndex) => {
          mapLayer.forEach((tiles, x) => {
            tiles.forEach((value, y) => {
              // Ground 1
              if (mapLayerIndex === 0 && value) {
                mapGround1[x + randomX][y + randomY] = value;
              }
              // Ground 2
              if (mapLayerIndex === 1 && value) {
                mapGround2[x + randomX][y + randomY] = value;
              }
              // Top 1
              if (mapLayerIndex === 2 && value) {
                mapTop1[x + randomX][y + randomY] = value;
              }
              // Blocked
              if (mapLayerIndex === 3 && value) {
                mapBlocked[x + randomX][y + randomY] = value;
              }
            });
          });
        });

        // Fill other fields
        if (blocks[block.id].animations) {
          animations.push(
            ...blocks[block.id].animations.map((animation) => ({
              ...animation,
              pos: [animation.pos[0] + randomX, animation.pos[1] + randomY]
            }))
          );
        }
        if (blocks[block.id].items) {
          items.push(
            ...blocks[block.id].items.map((item) => ({
              ...item,
              pos: [
                item.pos[0] + offset[0] + randomX,
                item.pos[1] + offset[1] + randomY
              ]
            }))
          );
        }
        if (blocks[block.id].enemies) {
          enemies.push(
            ...blocks[block.id].enemies.map((enemy) => ({
              ...enemy,
              pos: [
                enemy.pos[0] + offset[0] + randomX,
                enemy.pos[1] + offset[1] + randomY
              ]
            }))
          );
        }
      }
    });
  });

  // Small grass
  getRandomPositions(biome.grassAmount).forEach((pos) => {
    if (mapGround2[pos[0]][pos[1]] === 0) {
      mapGround2[pos[0]][pos[1]] =
        biome.grass[getRandomInt(biome.grass.length)];
    }
  });

  // Larger bushes
  getRandomPositions(biome.bushesAmount).forEach((pos) => {
    if (mapGround2[pos[0]][pos[1]] === 0) {
      mapGround2[pos[0]][pos[1]] =
        biome.bushes[getRandomInt(biome.bushes.length)];
      mapBlocked[pos[0]][pos[1]] = 1;
    }
  });

  return {
    mapGround1,
    mapGround2,
    mapTop1,
    mapBlocked,
    enemies,
    animations,
    items
  };
};

exports.generateChunk = generateChunk;
