const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { possibleBiomes } = config;

const getRandomBiome = () => {
  return possibleBiomes[getRandomInt(possibleBiomes.length)];
};

const getSurroundingChunks = ({ centerChunk, chunks }) => {
  const centerChunkBiome = centerChunk.biomeMap.center;
  console.log('centerChunkBiome', centerChunkBiome);
  const surroundingChunks = [];
  const top = {
    pos: [centerChunk.pos[0], centerChunk.pos[1] - 1],
    biomeMap: {
      center: getRandomBiome(),
      top: getRandomBiome(),
      right: getRandomBiome(),
      bottom: centerChunkBiome,
      left: getRandomBiome()
    }
  };
  const topRight = {
    pos: [centerChunk.pos[0] + 1, centerChunk.pos[1] - 1],
    biomeMap: {
      center: getRandomBiome(),
      top: getRandomBiome(),
      right: getRandomBiome(),
      bottom: getRandomBiome(),
      left: top.biomeMap.right
    }
  };
  const right = {
    pos: [centerChunk.pos[0] + 1, centerChunk.pos[1]],
    biomeMap: {
      center: getRandomBiome(),
      top: topRight.biomeMap.bottom,
      right: getRandomBiome(),
      bottom: getRandomBiome(),
      left: centerChunkBiome
    }
  };
  const bottomRight = {
    pos: [centerChunk.pos[0] + 1, centerChunk.pos[1] + 1],
    biomeMap: {
      center: getRandomBiome(),
      top: right.biomeMap.bottom,
      right: getRandomBiome(),
      bottom: getRandomBiome(),
      left: getRandomBiome()
    }
  };
  const bottom = {
    pos: [centerChunk.pos[0], centerChunk.pos[1] + 1],
    biomeMap: {
      center: getRandomBiome(),
      top: centerChunkBiome,
      right: bottomRight.biomeMap.left,
      bottom: getRandomBiome(),
      left: getRandomBiome()
    }
  };
  const bottomLeft = {
    pos: [centerChunk.pos[0] - 1, centerChunk.pos[1] + 1],
    biomeMap: {
      center: getRandomBiome(),
      top: getRandomBiome(),
      right: bottom.biomeMap.left,
      bottom: centerChunkBiome,
      left: getRandomBiome()
    }
  };
  const left = {
    pos: [centerChunk.pos[0] - 1, centerChunk.pos[1]],
    biomeMap: {
      center: getRandomBiome(),
      top: getRandomBiome(),
      right: centerChunkBiome,
      bottom: bottomLeft.biomeMap.top,
      left: getRandomBiome()
    }
  };
  const topLeft = {
    pos: [centerChunk.pos[0] - 1, centerChunk.pos[1] - 1],
    biomeMap: {
      center: getRandomBiome(),
      top: getRandomBiome(),
      right: top.biomeMap.left,
      bottom: left.biomeMap.top,
      left: getRandomBiome()
    }
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
    surroundingChunks.push(top);
  }
  if (!topRightExists) {
    surroundingChunks.push(topRight);
  }
  if (!rightExists) {
    surroundingChunks.push(right);
  }
  if (!bottomRightExists) {
    surroundingChunks.push(bottomRight);
  }
  if (!bottomExists) {
    surroundingChunks.push(bottom);
  }
  if (!bottomLeftExists) {
    surroundingChunks.push(bottomLeft);
  }
  if (!leftExists) {
    surroundingChunks.push(left);
  }
  if (!topLeftExists) {
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
        center: 'desert',
        top: 'desert',
        right: 'desert',
        bottom: 'desert',
        left: 'desert'
      }
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
