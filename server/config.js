const config = {
  chunkSize: 30,
  biomeNeighbours: {
    plain: ['forest', 'savannah'],
    forest: ['plain'],
    desert: ['savannah'],
    savannah: ['desert', 'plain']
  },
  startBiome: 'plain'
};

exports.config = config;
