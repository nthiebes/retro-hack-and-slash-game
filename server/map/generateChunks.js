const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { generateChunk } = require('./generateChunk.js');
const { startBiome, biomeNeighbours } = config;

const getRandomBiome = (biome) => {
  let tempPossibleBiomes = null;

  if (Array.isArray(biome) && biome.length > 0) {
    const biomes = biome.filter((name) => name); // remove undefined entries

    if (biomes[1]) {
      tempPossibleBiomes = [
        ...biomeNeighbours[biomes[0]].filter((name) =>
          biomeNeighbours[biomes[1]].includes(name)
        )
      ];
    } else if (biomes[2]) {
      tempPossibleBiomes = [
        ...biomeNeighbours[biomes[0]].filter(
          (name) =>
            biomeNeighbours[biomes[1]].includes(name) &&
            biomeNeighbours[biomes[2]].includes(name)
        )
      ];
    } else {
      tempPossibleBiomes = biomeNeighbours[biomes[0]];
    }
  } else {
    tempPossibleBiomes = [...biomeNeighbours[biome]];
  }

  return tempPossibleBiomes[getRandomInt(tempPossibleBiomes.length)];
};

// eslint-disable-next-line complexity
const getSurroundingChunks = ({ centerChunk, chunks }) => {
  const newChunks = [];
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
    topChunk.biome = getRandomBiome([
      topLeftChunk.biome,
      centerChunkBiome,
      topRightChunk.biome
    ]);
    topChunk.map = generateChunk({
      biome: topChunk.biome
    });
    newChunks.push(topChunk);
  }

  if (!topRightChunk.biome) {
    topRightChunk.biome = getRandomBiome([topChunk.biome, rightChunk.biome]);
    topRightChunk.map = generateChunk({
      biome: topRightChunk.biome
    });
    newChunks.push(topRightChunk);
  }

  if (!rightChunk.biome) {
    rightChunk.biome = getRandomBiome([
      topRightChunk.biome,
      centerChunkBiome,
      bottomRightChunk.biome
    ]);
    rightChunk.map = generateChunk({
      biome: rightChunk.biome
    });
    newChunks.push(rightChunk);
  }

  if (!bottomRightChunk.biome) {
    bottomRightChunk.biome = getRandomBiome([
      rightChunk.biome,
      bottomChunk.biome
    ]);
    bottomRightChunk.map = generateChunk({
      biome: bottomRightChunk.biome
    });
    newChunks.push(bottomRightChunk);
  }

  if (!bottomChunk.biome) {
    bottomChunk.biome = getRandomBiome([
      bottomRightChunk.biome,
      centerChunkBiome,
      bottomLeftChunk.biome
    ]);
    bottomChunk.map = generateChunk({
      biome: bottomChunk.biome
    });
    newChunks.push(bottomChunk);
  }

  if (!bottomLeftChunk.biome) {
    bottomLeftChunk.biome = getRandomBiome([
      bottomChunk.biome,
      leftChunk.biome
    ]);
    bottomLeftChunk.map = generateChunk({
      biome: bottomLeftChunk.biome
    });
    newChunks.push(bottomLeftChunk);
  }

  if (!leftChunk.biome) {
    leftChunk.biome = getRandomBiome([
      bottomLeftChunk.biome,
      centerChunkBiome,
      topLeftChunk.biome
    ]);
    leftChunk.map = generateChunk({
      biome: leftChunk.biome
    });
    newChunks.push(leftChunk);
  }

  if (!topLeftChunk.biome) {
    topLeftChunk.biome = getRandomBiome([leftChunk.biome, topChunk.biome]);
    topLeftChunk.map = generateChunk({
      biome: topLeftChunk.biome
    });
    newChunks.push(topLeftChunk);
  }

  return newChunks;
};

const generateChunks = ({ newGame, chunks, centerChunk }) => {
  const mapChunks = [...chunks];

  if (newGame) {
    const initialChunk = {
      pos: [0, 0],
      biome: startBiome,
      map: generateChunk({
        biome: startBiome
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
