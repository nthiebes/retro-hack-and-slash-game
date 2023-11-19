const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { generateChunk } = require('./generateChunk.js');
const { chunkSize, startBiome, biomeNeighbours } = config;

const getRandomBiome = (biome) => {
  const tempPossibleBiomes = [...biomeNeighbours[biome], biome, biome];

  return tempPossibleBiomes[getRandomInt(tempPossibleBiomes.length)];
};

const getSurroundingChunks = ({ centerChunk, chunks }) => {
  const centerChunkBiome = centerChunk.biomeMap.center;
  const surroundingChunks = [];
  const top = {
    pos: [centerChunk.pos[0], centerChunk.pos[1] - 1],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      bottom: centerChunkBiome
    }
  };
  top.biomeMap = {
    ...top.biomeMap,
    top: getRandomBiome(top.biomeMap.center),
    right: getRandomBiome(top.biomeMap.center),
    left: getRandomBiome(top.biomeMap.center)
  };

  const topRight = {
    pos: [centerChunk.pos[0] + 1, centerChunk.pos[1] - 1],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      left: top.biomeMap.right
    }
  };
  topRight.biomeMap = {
    ...topRight.biomeMap,
    top: getRandomBiome(topRight.biomeMap.center),
    right: getRandomBiome(topRight.biomeMap.center),
    bottom: getRandomBiome(topRight.biomeMap.center)
  };

  const right = {
    pos: [centerChunk.pos[0] + 1, centerChunk.pos[1]],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      top: topRight.biomeMap.bottom,
      left: centerChunkBiome
    }
  };
  right.biomeMap = {
    ...right.biomeMap,
    right: getRandomBiome(right.biomeMap.center),
    bottom: getRandomBiome(right.biomeMap.center)
  };

  const bottomRight = {
    pos: [centerChunk.pos[0] + 1, centerChunk.pos[1] + 1],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      top: right.biomeMap.bottom
    }
  };
  bottomRight.biomeMap = {
    ...bottomRight.biomeMap,
    right: getRandomBiome(bottomRight.biomeMap.center),
    bottom: getRandomBiome(bottomRight.biomeMap.center),
    left: getRandomBiome(bottomRight.biomeMap.center)
  };

  const bottom = {
    pos: [centerChunk.pos[0], centerChunk.pos[1] + 1],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      top: centerChunkBiome,
      right: bottomRight.biomeMap.left
    }
  };
  bottom.biomeMap = {
    ...bottom.biomeMap,
    bottom: getRandomBiome(bottom.biomeMap.center),
    left: getRandomBiome(bottom.biomeMap.center)
  };

  const bottomLeft = {
    pos: [centerChunk.pos[0] - 1, centerChunk.pos[1] + 1],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      right: bottom.biomeMap.left,
      bottom: centerChunkBiome
    }
  };
  bottomLeft.biomeMap = {
    ...bottomLeft.biomeMap,
    top: getRandomBiome(bottomLeft.biomeMap.center),
    left: getRandomBiome(bottomLeft.biomeMap.center)
  };

  const left = {
    pos: [centerChunk.pos[0] - 1, centerChunk.pos[1]],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      right: centerChunkBiome,
      bottom: bottomLeft.biomeMap.top
    }
  };
  left.biomeMap = {
    ...left.biomeMap,
    left: getRandomBiome(left.biomeMap.center),
    top: getRandomBiome(left.biomeMap.center)
  };

  const topLeft = {
    pos: [centerChunk.pos[0] - 1, centerChunk.pos[1] - 1],
    biomeMap: {
      center: getRandomBiome(centerChunkBiome),
      right: top.biomeMap.left,
      bottom: left.biomeMap.top
    }
  };
  topLeft.biomeMap = {
    ...topLeft.biomeMap,
    top: getRandomBiome(topLeft.biomeMap.center),
    left: getRandomBiome(topLeft.biomeMap.center)
  };

  const topExists = chunks.find(
    (chunk) => chunk.pos[0] === top.pos[0] && chunk.pos[1] === top.pos[1]
  );
  const topRightExists = chunks.find(
    (chunk) =>
      chunk.pos[0] === topRight.pos[0] && chunk.pos[1] === topRight.pos[1]
  );
  const rightExists = chunks.find(
    (chunk) => chunk.pos[0] === right.pos[0] && chunk.pos[1] === right.pos[1]
  );
  const bottomRightExists = chunks.find(
    (chunk) =>
      chunk.pos[0] === bottomRight.pos[0] && chunk.pos[1] === bottomRight.pos[1]
  );
  const bottomExists = chunks.find(
    (chunk) => chunk.pos[0] === bottom.pos[0] && chunk.pos[1] === bottom.pos[1]
  );
  const bottomLeftExists = chunks.find(
    (chunk) =>
      chunk.pos[0] === bottomLeft.pos[0] && chunk.pos[1] === bottomLeft.pos[1]
  );
  const leftExists = chunks.find(
    (chunk) => chunk.pos[0] === left.pos[0] && chunk.pos[1] === left.pos[1]
  );
  const topLeftExists = chunks.find(
    (chunk) =>
      chunk.pos[0] === topLeft.pos[0] && chunk.pos[1] === topLeft.pos[1]
  );

  if (!topExists) {
    top.map = generateChunk({
      biome: top.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(top);
  }
  if (!topRightExists) {
    topRight.map = generateChunk({
      biome: topRight.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(topRight);
  }
  if (!rightExists) {
    right.map = generateChunk({
      biome: right.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(right);
  }
  if (!bottomRightExists) {
    bottomRight.map = generateChunk({
      biome: bottomRight.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(bottomRight);
  }
  if (!bottomExists) {
    bottom.map = generateChunk({
      biome: bottom.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(bottom);
  }
  if (!bottomLeftExists) {
    bottomLeft.map = generateChunk({
      biome: bottomLeft.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(bottomLeft);
  }
  if (!leftExists) {
    left.map = generateChunk({
      biome: left.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(left);
  }
  if (!topLeftExists) {
    topLeft.map = generateChunk({
      biome: topLeft.biomeMap.center,
      offset: [chunkSize, chunkSize]
    });
    surroundingChunks.push(topLeft);
  }

  return surroundingChunks;
};

const generateChunks = ({ newGame, chunks, centerChunk }) => {
  const mapChunks = [...chunks];

  if (newGame) {
    const initialChunk = {
      pos: [0, 0],
      biomeMap: {
        center: startBiome,
        top: startBiome,
        right: startBiome,
        bottom: startBiome,
        left: startBiome
      },
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
