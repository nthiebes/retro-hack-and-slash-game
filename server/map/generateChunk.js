const { blocks } = require('./data/blocks.js');
const { biomes } = require('./data/biomes.js');
const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { chunkSize } = config;

const getRandomPositions = (max) => {
  const count = max;
  const randomPositions = [];

  for (let i = 0; i < count; i++) {
    randomPositions.push([getRandomInt(chunkSize), getRandomInt(chunkSize)]);
  }

  return randomPositions;
};

const generateChunk = ({ biome: biomeName, offset }) => {
  const biome = biomes[biomeName];
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

  if (biome.ground === 1360) {
    mapGround1 = new Array(chunkSize).fill(0).map((_, index) => {
      const innerGround1 = new Array(chunkSize).fill(0);

      if (index % 4 === 0) {
        return innerGround1.map((__, innerIndex) => {
          if (innerIndex % 4 === 0) {
            return 1360;
          } else if ((innerIndex + 1) % 4 === 0) {
            return 1363;
          } else if ((innerIndex + 2) % 4 === 0) {
            return 1362;
          }
          return 1361;
        });
      }

      if ((index + 1) % 4 === 0) {
        return innerGround1.map((__, innerIndex) => {
          if (innerIndex % 4 === 0) {
            return 1408;
          } else if ((innerIndex + 1) % 4 === 0) {
            return 1411;
          } else if ((innerIndex + 2) % 4 === 0) {
            return 1410;
          }
          return 1409;
        });
      }

      if ((index + 2) % 4 === 0) {
        return innerGround1.map((__, innerIndex) => {
          if (innerIndex % 4 === 0) {
            return 1392;
          } else if ((innerIndex + 1) % 4 === 0) {
            return 1395;
          } else if ((innerIndex + 2) % 4 === 0) {
            return 1394;
          }
          return 1393;
        });
      }

      return innerGround1.map((__, innerIndex) => {
        if (innerIndex % 4 === 0) {
          return 1376;
        } else if ((innerIndex + 1) % 4 === 0) {
          return 1379;
        } else if ((innerIndex + 2) % 4 === 0) {
          return 1378;
        }
        return 1377;
      });
    });
  } else if (biome.ground === 1) {
    mapGround1 = new Array(chunkSize).fill(0).map((_, index) => {
      const innerGround1 = new Array(chunkSize).fill(0);

      if (index % 4 === 0) {
        return innerGround1.map((__, innerIndex) => {
          if (innerIndex % 4 === 0) {
            return 1;
          } else if ((innerIndex + 1) % 4 === 0) {
            return 4;
          } else if ((innerIndex + 2) % 4 === 0) {
            return 3;
          }
          return 2;
        });
      }

      if ((index + 1) % 4 === 0) {
        return innerGround1.map((__, innerIndex) => {
          if (innerIndex % 4 === 0) {
            return 49;
          } else if ((innerIndex + 1) % 4 === 0) {
            return 52;
          } else if ((innerIndex + 2) % 4 === 0) {
            return 51;
          }
          return 50;
        });
      }

      if ((index + 2) % 4 === 0) {
        return innerGround1.map((__, innerIndex) => {
          if (innerIndex % 4 === 0) {
            return 33;
          } else if ((innerIndex + 1) % 4 === 0) {
            return 36;
          } else if ((innerIndex + 2) % 4 === 0) {
            return 35;
          }
          return 34;
        });
      }

      return innerGround1.map((__, innerIndex) => {
        if (innerIndex % 4 === 0) {
          return 17;
        } else if ((innerIndex + 1) % 4 === 0) {
          return 20;
        } else if ((innerIndex + 2) % 4 === 0) {
          return 19;
        }
        return 18;
      });
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
              pos: [item.pos[0] + offset[0], item.pos[1] + offset[1]]
            }))
          );
        }
        if (blocks[block.id].enemies) {
          enemies.push(
            ...blocks[block.id].enemies.map((enemy) => ({
              ...enemy,
              pos: [enemy.pos[0] + offset[0], enemy.pos[1] + offset[1]]
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
