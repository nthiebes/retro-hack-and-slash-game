const config = {
  chunkSize: 30,
  debug: false,
  biomeNeighbours: {
    plain: ['plain', 'lightForest', 'flowerPlain', 'rockyPlain', 'savannah'],
    flowerPlain: ['flowerPlain', 'plain', 'lightForest'],
    rockyPlain: ['plain', 'rockyPlain', 'lightForest'],
    lightForest: ['plain', 'forest'],
    forest: ['forest', 'lightForest', 'blackForest', 'deadForest'],
    blackForest: ['blackForest', 'forest'],
    deadForest: ['deadForest', 'forest'],
    desert: ['desert', 'savannah', 'oasis'],
    oasis: ['desert', 'oasis'],
    savannah: ['savannah', 'desert', 'plain']
  },
  startBiome: 'plain'
};

exports.config = config;
