const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { generateChunk } = require('./generateChunk.js');
const { chunkSize, startBiome, biomeNeighbours } = config;

const getRandomBiome = (biome) => {
  let tempPossibleBiomes = null;

  if (Array.isArray(biome)) {
    tempPossibleBiomes = [
      ...biomeNeighbours[biome[0]].filter((name) =>
        biomeNeighbours[biome[1]].includes(name)
      )
    ];
  } else {
    tempPossibleBiomes = [...biomeNeighbours[biome]];
  }

  return tempPossibleBiomes[getRandomInt(tempPossibleBiomes.length)];
};

const getSurroundingChunks = ({ centerChunk, chunks }) => {
  const centerChunkBiome = centerChunk.biome;
  const topPos = [centerChunk.pos[0], centerChunk.pos[1] - 1];
  const topRightPos = [centerChunk.pos[0] + 1, centerChunk.pos[1] - 1];
  const rightPos = [centerChunk.pos[0] + 1, centerChunk.pos[1]];
  const bottomRightPos = [centerChunk.pos[0] + 1, centerChunk.pos[1] + 1];
  const bottomPos = [centerChunk.pos[0], centerChunk.pos[1] + 1];
  const bottomLeftPos = [centerChunk.pos[0] - 1, centerChunk.pos[1] + 1];
  const leftPos = [centerChunk.pos[0] - 1, centerChunk.pos[1]];
  const topLeftPos = [centerChunk.pos[0] - 1, centerChunk.pos[1] - 1];

  const topChunk = chunks.find(
    (chunk) => chunk.pos[0] === topPos[0] && chunk.pos[1] === topPos[1]
  ) || {
    pos: topPos
  };
  const topRightChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === topRightPos[0] && chunk.pos[1] === topRightPos[1]
  ) || {
    pos: topRightPos
  };
  const rightChunk = chunks.find(
    (chunk) => chunk.pos[0] === rightPos[0] && chunk.pos[1] === rightPos[1]
  ) || {
    pos: rightPos
  };
  const bottomRightChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === bottomRightPos[0] && chunk.pos[1] === bottomRightPos[1]
  ) || {
    pos: bottomRightPos
  };
  const bottomChunk = chunks.find(
    (chunk) => chunk.pos[0] === bottomPos[0] && chunk.pos[1] === bottomPos[1]
  ) || { pos: bottomPos };
  const bottomLeftChunk = chunks.find(
    (chunk) =>
      chunk.pos[0] === bottomLeftPos[0] && chunk.pos[1] === bottomLeftPos[1]
  ) || { pos: bottomLeftPos };
  const leftChunk = chunks.find(
    (chunk) => chunk.pos[0] === leftPos[0] && chunk.pos[1] === leftPos[1]
  ) || { pos: leftPos };
  const topLeftChunk = chunks.find(
    (chunk) => chunk.pos[0] === topLeftPos[0] && chunk.pos[1] === topLeftPos[1]
  ) || {
    pos: topLeftPos
  };

  if (!topChunk.biome) {
    topChunk.biome = getRandomBiome(centerChunkBiome);
    topChunk.map = generateChunk({
      biome: topChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!topRightChunk.biome) {
    topRightChunk.biome = getRandomBiome(topChunk.biome);
    topRightChunk.map = generateChunk({
      biome: topRightChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!rightChunk.biome) {
    rightChunk.biome = getRandomBiome([topRightChunk.biome, centerChunkBiome]);
    rightChunk.map = generateChunk({
      biome: rightChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!bottomRightChunk.biome) {
    bottomRightChunk.biome = getRandomBiome(rightChunk.biome);
    bottomRightChunk.map = generateChunk({
      biome: bottomRightChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!bottomChunk.biome) {
    bottomChunk.biome = getRandomBiome([
      bottomRightChunk.biome,
      centerChunkBiome
    ]);
    bottomChunk.map = generateChunk({
      biome: bottomChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!bottomLeftChunk.biome) {
    bottomLeftChunk.biome = getRandomBiome(bottomChunk.biome);
    bottomLeftChunk.map = generateChunk({
      biome: bottomLeftChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!leftChunk.biome) {
    leftChunk.biome = getRandomBiome([bottomLeftChunk.biome, centerChunkBiome]);
    leftChunk.map = generateChunk({
      biome: leftChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  if (!topLeftChunk.biome) {
    topLeftChunk.biome = getRandomBiome([leftChunk.biome, topChunk.biome]);
    topLeftChunk.map = generateChunk({
      biome: topLeftChunk.biome,
      offset: [chunkSize, chunkSize]
    });
  }

  return [
    topChunk,
    topRightChunk,
    rightChunk,
    bottomRightChunk,
    bottomChunk,
    bottomLeftChunk,
    leftChunk,
    topLeftChunk
  ];
};

const generateChunks = ({ newGame, chunks, centerChunk }) => {
  const mapChunks = [...chunks];

  if (newGame) {
    const initialChunk = {
      pos: [0, 0],
      biome: startBiome,
      map: generateChunk({
        biome: startBiome,
        offset: [chunkSize, chunkSize]
      })
    };

    mapChunks.push(
      initialChunk,
      ...getSurroundingChunks({ centerChunk: initialChunk, chunks })
    );
  } else {
    mapChunks.push(...getSurroundingChunks({ centerChunk, chunks }));
  }

  return mapChunks;
};

exports.generateChunks = generateChunks;
