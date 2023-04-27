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
    grass: [983, 999, 963],
    grassAmount: 100,
    bushes: [982, 837, 838, 839, 993],
    bushesAmount: 15,
    blocks: [
      {
        id: 'deadTree0',
        amount: 5
      },
      {
        id: 'deadTree1',
        amount: 3
      }
    ]
  },
  swamp: {},
  mountains: {},
  savannah: {},
  cave: {}
};

exports.biomes = biomes;
