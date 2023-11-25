const config = {
  chunkSize: 30,
  biomeNeighbours: {
    plain: ['plain', 'lightForest', 'flowerPlain', 'rockyPlain', 'savannah'],
    flowerPlain: ['flowerPlain', 'plain', 'lightForest', 'rockyPlain'],
    rockyPlain: ['flowerPlain', 'plain', 'lightForest', 'rockyPlain'],
    lightForest: [
      'plain',
      'flowerPlain',
      'rockyPlain',
      'lightForest',
      'forest',
      'blackForest',
      'deadForest'
    ],
    forest: ['plain', 'forest', 'lightForest', 'blackForest', 'deadForest'],
    blackForest: [
      'plain',
      'blackForest',
      'lightForest',
      'forest',
      'deadForest'
    ],
    deadForest: ['plain', 'deadForest', 'blackForest', 'lightForest', 'forest'],
    desert: ['desert', 'savannah', 'oasis'],
    oasis: ['desert', 'oasis'],
    savannah: ['savannah', 'desert', 'plain']
  },
  startBiome: 'plain'
};

exports.config = config;
