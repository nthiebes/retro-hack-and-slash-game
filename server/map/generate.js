const { getRandomInt } = require('../utils/number.js');
const { config } = require('../config.js');
const { biomes } = require('./data/biomes.js');
const { generateChunk } = require('./generateChunk.js');
const { chunkSize } = config;

const generateMap = ({ chunks }) => {
  const centerBiome = biomes[chunks[0].biomeMap.center];
  const topBiome = biomes[chunks[1].biomeMap.center];
  const topRightBiome = biomes[chunks[2].biomeMap.center];
  const rightBiome = biomes[chunks[3].biomeMap.center];
  const bottomRightBiome = biomes[chunks[4].biomeMap.center];
  const bottomBiome = biomes[chunks[5].biomeMap.center];
  const bottomLeftBiome = biomes[chunks[6].biomeMap.center];
  const leftBiome = biomes[chunks[7].biomeMap.center];
  const topLeftBiome = biomes[chunks[8].biomeMap.center];
  const centerChunk = generateChunk(centerBiome);
  const topChunk = generateChunk(topBiome);
  const topRightChunk = generateChunk(topRightBiome);
  const rightChunk = generateChunk(rightBiome);
  const bottomRightChunk = generateChunk(bottomRightBiome);
  const bottomChunk = generateChunk(bottomBiome);
  const bottomLeftChunk = generateChunk(bottomLeftBiome);
  const leftChunk = generateChunk(leftBiome);
  const topLeftChunk = generateChunk(topLeftBiome);

  // Ground 1
  const topChunksGround1 = topLeftChunk.mapGround1;
  const centerChunksGround1 = leftChunk.mapGround1;
  const bottomChunksGround1 = bottomLeftChunk.mapGround1;

  topChunksGround1.forEach((row, index) => {
    row.push(
      ...[...topChunk.mapGround1[index], ...topRightChunk.mapGround1[index]]
    );
  });
  centerChunksGround1.forEach((row, index) => {
    row.push(
      ...[...centerChunk.mapGround1[index], ...rightChunk.mapGround1[index]]
    );
  });
  bottomChunksGround1.forEach((row, index) => {
    row.push(
      ...[
        ...bottomChunk.mapGround1[index],
        ...bottomRightChunk.mapGround1[index]
      ]
    );
  });

  const mapGround1 = [
    ...topChunksGround1,
    ...centerChunksGround1,
    ...bottomChunksGround1
  ];

  // Ground 2
  const topChunksGround2 = topLeftChunk.mapGround2;
  const centerChunksGround2 = leftChunk.mapGround2;
  const bottomChunksGround2 = bottomLeftChunk.mapGround2;

  topChunksGround2.forEach((row, index) => {
    row.push(
      ...[...topChunk.mapGround2[index], ...topRightChunk.mapGround2[index]]
    );
  });
  centerChunksGround2.forEach((row, index) => {
    row.push(
      ...[...centerChunk.mapGround2[index], ...rightChunk.mapGround2[index]]
    );
  });
  bottomChunksGround2.forEach((row, index) => {
    row.push(
      ...[
        ...bottomChunk.mapGround2[index],
        ...bottomRightChunk.mapGround2[index]
      ]
    );
  });

  const mapGround2 = [
    ...topChunksGround2,
    ...centerChunksGround2,
    ...bottomChunksGround2
  ];

  // Top 1
  const topChunksTop1 = topLeftChunk.mapTop1;
  const centerChunksTop1 = leftChunk.mapTop1;
  const bottomChunksTop1 = bottomLeftChunk.mapTop1;

  topChunksTop1.forEach((row, index) => {
    row.push(...[...topChunk.mapTop1[index], ...topRightChunk.mapTop1[index]]);
  });
  centerChunksTop1.forEach((row, index) => {
    row.push(...[...centerChunk.mapTop1[index], ...rightChunk.mapTop1[index]]);
  });
  bottomChunksTop1.forEach((row, index) => {
    row.push(
      ...[...bottomChunk.mapTop1[index], ...bottomRightChunk.mapTop1[index]]
    );
  });

  const mapTop1 = [...topChunksTop1, ...centerChunksTop1, ...bottomChunksTop1];

  // Blocked
  const topChunksBlocked = topLeftChunk.mapBlocked;
  const centerChunksBlocked = leftChunk.mapBlocked;
  const bottomChunksBlocked = bottomLeftChunk.mapBlocked;

  topChunksBlocked.forEach((row, index) => {
    row.push(
      ...[...topChunk.mapBlocked[index], ...topRightChunk.mapBlocked[index]]
    );
  });
  centerChunksBlocked.forEach((row, index) => {
    row.push(
      ...[...centerChunk.mapBlocked[index], ...rightChunk.mapBlocked[index]]
    );
  });
  bottomChunksBlocked.forEach((row, index) => {
    row.push(
      ...[
        ...bottomChunk.mapBlocked[index],
        ...bottomRightChunk.mapBlocked[index]
      ]
    );
  });

  const mapBlocked = [
    ...topChunksBlocked,
    ...centerChunksBlocked,
    ...bottomChunksBlocked
  ];
  const playerPosition = Math.round((chunkSize * 3) / 2);

  return {
    players: [[playerPosition, playerPosition]],
    enemies: [],
    items: [],
    animations: [],
    maps: [],
    map: [mapGround1, mapGround2, mapTop1, mapBlocked]
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
