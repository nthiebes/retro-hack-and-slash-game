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
  const centerChunk = generateChunk({
    biome: centerBiome,
    offset: [chunkSize, chunkSize]
  });
  const topChunk = generateChunk({ biome: topBiome, offset: [chunkSize, 0] });
  const topRightChunk = generateChunk({
    biome: topRightBiome,
    offset: [chunkSize * 2, 0]
  });
  const rightChunk = generateChunk({
    biome: rightBiome,
    offset: [chunkSize * 2, chunkSize]
  });
  const bottomRightChunk = generateChunk({
    biome: bottomRightBiome,
    offset: [chunkSize * 2, chunkSize * 2]
  });
  const bottomChunk = generateChunk({
    biome: bottomBiome,
    offset: [chunkSize, chunkSize * 2]
  });
  const bottomLeftChunk = generateChunk({
    biome: bottomLeftBiome,
    offset: [0, chunkSize * 2]
  });
  const leftChunk = generateChunk({ biome: leftBiome, offset: [0, chunkSize] });
  const topLeftChunk = generateChunk({ biome: topLeftBiome, offset: [0, 0] });

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
    enemies: [
      ...centerChunk.enemies,
      ...topChunk.enemies,
      ...topRightChunk.enemies,
      ...rightChunk.enemies,
      ...bottomRightChunk.enemies,
      ...bottomChunk.enemies,
      ...bottomLeftChunk.enemies,
      ...leftChunk.enemies,
      ...topLeftChunk.enemies
    ],
    items: [
      ...centerChunk.items,
      ...topChunk.items,
      ...topRightChunk.items,
      ...rightChunk.items,
      ...bottomRightChunk.items,
      ...bottomChunk.items,
      ...bottomLeftChunk.items,
      ...leftChunk.items,
      ...topLeftChunk.items
    ],
    animations: [
      ...centerChunk.animations,
      ...topChunk.animations,
      ...topRightChunk.animations,
      ...rightChunk.animations,
      ...bottomRightChunk.animations,
      ...bottomChunk.animations,
      ...bottomLeftChunk.animations,
      ...leftChunk.animations,
      ...topLeftChunk.animations
    ],
    maps: [],
    map: [mapGround1, mapGround2, mapTop1, mapBlocked]
  };
};

exports.generateMap = generateMap;
