const biomes = {
  plain: {
    ground: 1360,
    grass: [1397, 1398, 1399, 1400],
    grassAmount: 20,
    bushes: [],
    bushesAmount: 0,
    blocks: [
      {
        id: 'allItems',
        amount: 3
      },
      {
        id: 'grass0',
        amount: 5
      }
    ]
  },
  forest: {
    ground: 1360,
    grass: [1396],
    grassAmount: 5,
    bushes: [],
    bushesAmount: 0,
    blocks: [
      {
        id: 'tree0',
        amount: 15
      }
    ]
  },
  desert: {
    ground: 1,
    grass: [],
    grassAmount: 0,
    bushes: [64],
    bushesAmount: 5,
    blocks: [
      {
        id: 'palm4',
        amount: 2
      },
      {
        id: 'palm5',
        amount: 2
      },
      {
        id: 'palm3',
        amount: 2
      },
      {
        id: 'palm2',
        amount: 2
      },
      {
        id: 'palm0',
        amount: 3
      },
      {
        id: 'palm1',
        amount: 3
      },
      {
        id: 'camp0',
        amount: 1
      },
      {
        id: 'skull0',
        amount: 1
      },
      {
        id: 'cactus0',
        amount: 3
      },
      {
        id: 'cactus1',
        amount: 3
      },
      {
        id: 'cactus2',
        amount: 3
      },
      {
        id: 'cactus3',
        amount: 3
      },
      {
        id: 'cactus4',
        amount: 3
      },
      {
        id: 'cactus5',
        amount: 3
      },
      {
        id: 'cube0',
        amount: 3
      },
      {
        id: 'cube1',
        amount: 3
      },
      {
        id: 'stone6',
        amount: 2
      },
      {
        id: 'tent0',
        amount: 1
      },
      {
        id: 'lake0',
        amount: 1
      },
      {
        id: 'ship0',
        amount: 1
      },
      {
        id: 'pyramid0',
        amount: 1
      },
      {
        id: 'bush0',
        amount: 5
      }
    ]
  },
  savannah: {
    ground: 1,
    grass: [],
    grassAmount: 0,
    bushes: [],
    bushesAmount: 0,
    blocks: [
      {
        id: 'rock0',
        amount: 1
      },
      {
        id: 'rock1',
        amount: 1
      },
      {
        id: 'rock2',
        amount: 1
      },
      {
        id: 'tree0',
        amount: 2
      },
      {
        id: 'tree1',
        amount: 2
      },
      {
        id: 'tree2',
        amount: 2
      },
      {
        id: 'deadTree0',
        amount: 2
      },
      {
        id: 'deadTree1',
        amount: 2
      },
      {
        id: 'stone5',
        amount: 2
      },
      {
        id: 'stone4',
        amount: 2
      },
      {
        id: 'stone0',
        amount: 3
      },
      {
        id: 'stone1',
        amount: 3
      },
      {
        id: 'stone2',
        amount: 3
      },
      {
        id: 'stone3',
        amount: 3
      },
      {
        id: 'skull0',
        amount: 1
      },
      {
        id: 'log0',
        amount: 1
      },
      {
        id: 'grass0',
        amount: 20
      },
      {
        id: 'grass1',
        amount: 20
      },
      {
        id: 'wagon0',
        amount: 1
      }
    ]
  },
  swamp: {},
  mountains: {},
  cave: {}
};

exports.biomes = biomes;
