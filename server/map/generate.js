const { biomes } = require('./data/biomes.js');
const { blocks } = require('./data/blocks.js');
const { getRandomInt } = require('../utils/number.js');
const mapSize = 50;
const getRandomPositions = (max) => {
  const count = max || mapSize;
  const randomPositions = [];

  for (let i = 0; i < count; i++) {
    randomPositions.push([getRandomInt(mapSize), getRandomInt(mapSize)]);
  }

  return randomPositions;
};
const generateChunk = (biome) => {
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

  if (biome.ground === 32) {
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
      .map(() => new Array(mapSize).fill(biome.ground));
  }

  // Blocks
  biome.blocks.forEach((block) => {
    getRandomPositions(block.amount * (mapSize / 50)).forEach((pos) => {
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
  getRandomPositions(biome.grassAmount * (mapSize / 50)).forEach((pos) => {
    if (mapGround2[pos[0]][pos[1]] === 0) {
      mapGround2[pos[0]][pos[1]] =
        biome.grass[getRandomInt(biome.grass.length)];
    }
  });

  // Larger bushes
  getRandomPositions(biome.grassAmount * (mapSize / 50)).forEach((pos) => {
    if (mapGround2[pos[0]][pos[1]] === 0) {
      mapGround2[pos[0]][pos[1]] =
        biome.bushes[getRandomInt(biome.bushes.length)];
      mapBlocked[pos[0]][pos[1]] = 1;
    }
  });

  console.log([mapGround1, mapGround2, mapTop1, mapBlocked]);

  return [mapGround1, mapGround2, mapTop1, mapBlocked];
};
const generateMap = ({ chunks }) => {
  const biome = biomes[chunks[0].biomeMap.center];

  //   chunks.forEach((chunk) => {});

  return {
    players: [[10, 10]],
    enemies: [],
    items: [],
    animations: [],
    maps: [],
    map: generateChunk(biome)
  };
};
const getRandomBiome = () => {
  const possibleBiomes = ['plain', 'forest'];

  return possibleBiomes[getRandomInt(possibleBiomes.length)];
};
const getSurroundingChunks = ({ centerChunk }) => {
  const top = {
    center: getRandomBiome(),
    top: getRandomBiome(),
    right: getRandomBiome(),
    bottom: centerChunk,
    left: getRandomBiome()
  };
  const topRight = {
    center: getRandomBiome(),
    top: getRandomBiome(),
    right: getRandomBiome(),
    bottom: getRandomBiome(),
    left: top.right
  };
  const right = {
    center: getRandomBiome(),
    top: topRight.bottom,
    right: getRandomBiome(),
    bottom: getRandomBiome(),
    left: centerChunk
  };
  const bottomRight = {
    center: getRandomBiome(),
    top: right.bottom,
    right: getRandomBiome(),
    bottom: getRandomBiome(),
    left: getRandomBiome()
  };
  const bottom = {
    center: getRandomBiome(),
    top: centerChunk,
    right: bottomRight.left,
    bottom: getRandomBiome(),
    left: getRandomBiome()
  };
  const bottomLeft = {
    center: getRandomBiome(),
    top: getRandomBiome(),
    right: bottom.left,
    bottom: centerChunk,
    left: getRandomBiome()
  };
  const left = {
    center: getRandomBiome(),
    top: getRandomBiome(),
    right: centerChunk,
    bottom: bottomLeft.top,
    left: getRandomBiome()
  };
  const topLeft = {
    center: getRandomBiome(),
    top: getRandomBiome(),
    right: top.left,
    bottom: left.top,
    left: getRandomBiome()
  };

  return [
    {
      pos: [0, -1],
      biomeMap: top
    },
    {
      pos: [1, -1],
      biomeMap: topRight
    },
    {
      pos: [1, 0],
      biomeMap: right
    },
    {
      pos: [1, 1],
      biomeMap: bottomRight
    },
    {
      pos: [0, 1],
      biomeMap: bottom
    },
    {
      pos: [-1, 1],
      biomeMap: bottomLeft
    },
    {
      pos: [-1, 0],
      biomeMap: left
    },
    {
      pos: [-1, -1],
      biomeMap: topLeft
    }
  ];
};
const generateChunks = ({ newGame }) => {
  const mapChunks = [
    {
      pos: [0, 0],
      biomeMap: {
        center: 'plain',
        top: 'plain',
        right: 'plain',
        bottom: 'plain',
        left: 'plain'
      }
    }
  ];

  if (newGame) {
    mapChunks.push(...getSurroundingChunks({ centerChunk: 'plain' }));
  }

  return mapChunks;
};

exports.generateMap = generateMap;
exports.generateChunks = generateChunks;
