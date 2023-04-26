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

const generateChunk = (biome) => {
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
      let tileOccupied = false;

      // Check for occupied tiles
      blocks[block.id].forEach((mapLayer, mapLayerIndex) => {
        mapLayer.forEach((tiles, x) => {
          tiles.forEach((value, y) => {
            const randomX = pos[0];
            const randomY = pos[1];
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
        blocks[block.id].forEach((mapLayer, mapLayerIndex) => {
          mapLayer.forEach((tiles, x) => {
            tiles.forEach((value, y) => {
              const randomX = pos[0];
              const randomY = pos[1];
              const inChunkBorder =
                x + randomX < chunkSize && y + randomY < chunkSize;

              // Ground 1
              if (mapLayerIndex === 0 && value && inChunkBorder) {
                mapGround1[x + randomX][y + randomY] = value;
              }
              // Ground 2
              if (mapLayerIndex === 1 && value && inChunkBorder) {
                mapGround2[x + randomX][y + randomY] = value;
              }
              // Top 1
              if (mapLayerIndex === 2 && value && inChunkBorder) {
                mapTop1[x + randomX][y + randomY] = value;
              }
              // Blocked
              if (mapLayerIndex === 3 && value && inChunkBorder) {
                mapBlocked[x + randomX][y + randomY] = value;
              }
            });
          });
        });
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

  return { mapGround1, mapGround2, mapTop1, mapBlocked };
};

exports.generateChunk = generateChunk;
