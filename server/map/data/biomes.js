const biomes = {
  plain: {
    ground: 32,
    grass: [672, 673, 674, 688, 533, 944, 945, 946, 947, 928, 929, 931, 1010],
    grassAmount: 100,
    bushes: [689, 690, 691, 773, 997, 692, 693],
    bushesAmount: 15,
    blocks: [
      {
        id: 'choppedTrees',
        amount: 1
      },
      {
        id: 'grasPatch0',
        amount: 1
      },
      {
        id: 'tree0',
        amount: 2
      },
      {
        id: 'tree1',
        amount: 1
      },
      {
        id: 'tree3',
        amount: 3
      },
      {
        id: 'tree4',
        amount: 2
      }
    ]
  },
  forest: {
    ground: 32,
    grass: [
      672,
      673,
      674,
      688,
      533,
      373,
      453,
      389,
      437,
      454,
      438,
      439,
      455,
      469,
      470,
      471,
      485,
      486,
      487
    ],
    grassAmount: 75,
    bushes: [689, 690, 691, 706, 707, 772, 773, 995],
    bushesAmount: 40,
    blocks: [
      {
        id: 'tree0',
        amount: 25
      },
      {
        id: 'tree1',
        amount: 50
      },
      {
        id: 'tree2',
        amount: 75
      },
      {
        id: 'stump0',
        amount: 3
      },
      {
        id: 'stump1',
        amount: 3
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
      }
    ]
  },
  savannah: {
    ground: 1,
    grass: [],
    grassAmount: 0,
    bushes: [0],
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
        id: 'gras0',
        amount: 20
      },
      {
        id: 'gras1',
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
