const biomes = {
  plain: {
    grass: [672, 673, 674, 688, 533],
    bushes: [689, 690, 724, 691],
    blocks: ['tree0']
  },
  forest: {
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
    grassAmount: 1,
    bushes: [689, 690, 724, 691, 706, 707, 772, 773, 995],
    bushesAmount: 1,
    blocks: [
      {
        id: 'tree0',
        amount: 1
      },
      {
        id: 'tree1',
        amount: 1.5
      },
      {
        id: 'tree2',
        amount: 2
      },
      {
        id: 'stump0',
        amount: 0.1
      },
      {
        id: 'stump1',
        amount: 0.1
      }
    ]
  }
};

exports.biomes = biomes;
