const { biomes } = require('../../game/data/biomes.js');
const { blocks } = require('../../game/data/mapBlocks.js');
const { getRandomInt } = require('../utils/number.js');
const mapSize = 50;
const groundValue = 32;
const getRandomPositions = (max) => {
  const count = max || mapSize;
  const randomPositions = [];

  for (let i = 0; i < count; i++) {
    randomPositions.push([getRandomInt(mapSize), getRandomInt(mapSize)]);
  }

  return randomPositions;
};
const generateMap = () => {
  const biome = 'forest';
  const mapGround2 = new Array(mapSize)
    .fill(0)
    .map(() => new Array(mapSize).fill(0));
  const mapTop1 = new Array(mapSize)
    .fill(0)
    .map(() => new Array(mapSize).fill(0));
  const mapBlocked = new Array(mapSize)
    .fill(0)
    .map(() => new Array(mapSize).fill(0));
  let mapGround1;

  if (groundValue === 32) {
    mapGround1 = new Array(mapSize).fill(0).map((_, index) => {
      const innerGround1 = new Array(mapSize).fill(0);

      if (index % 2) {
        return innerGround1.map((__, innerIndex) =>
          innerIndex % 2 ? 143 : 142
        );
      }

      return innerGround1.map((__, innerIndex) => (innerIndex % 2 ? 127 : 126));
    });
  } else {
    mapGround1 = new Array(mapSize)
      .fill(0)
      .map(() => new Array(mapSize).fill(groundValue));
  }

  // Blocks
  biomes[biome].blocks.forEach((block) => {
    getRandomPositions(block.amount * mapSize).forEach((pos) => {
      let tileOccupied = false;

      // Check for occupied tiles
      blocks[block.id].forEach((mapLayer, mapLayerIndex) => {
        mapLayer.forEach((tiles, x) => {
          tiles.forEach((value, y) => {
            const randomX = pos[0];
            const randomY = pos[1];
            const inChunkBorder =
              x + randomX < mapSize && y + randomY < mapSize;

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
                x + randomX < mapSize && y + randomY < mapSize;

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
  getRandomPositions(biomes[biome].grassAmount * mapSize).forEach((pos) => {
    if (mapGround2[pos[0]][pos[1]] === 0) {
      mapGround2[pos[0]][pos[1]] =
        biomes[biome].grass[getRandomInt(biomes[biome].grass.length)];
    }
  });

  // Larger bushes
  getRandomPositions(biomes[biome].grassAmount * mapSize).forEach((pos) => {
    if (mapGround2[pos[0]][pos[1]] === 0) {
      mapGround2[pos[0]][pos[1]] =
        biomes[biome].bushes[getRandomInt(biomes[biome].bushes.length)];
      mapBlocked[pos[0]][pos[1]] = 1;
    }
  });

  return {
    name: 'whatever',
    players: [[10, 10]],
    enemies: [],
    items: [],
    animations: [],
    maps: [],
    map: [mapGround1, mapGround2, mapTop1, mapBlocked]
  };
};

exports.generateMap = generateMap;
