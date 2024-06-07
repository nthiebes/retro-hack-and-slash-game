import '../../../node_modules/howler/dist/howler.core.min.js';

import { getRandomInt } from './number.js';

let isGruntPlaying = false;
const orcSprite = new Howl({
  src: ['/game/sounds/orcs.mp3'],
  preload: true,
  volume: 0.5,
  onend: () => {
    isGruntPlaying = false;
  },
  sprite: {
    grunt0: [400, 1500],
    grunt1: [3400, 2500],
    grunt2: [7400, 3500],
    grunt3: [12500, 2000],
    grunt4: [15600, 2000],
    grunt5: [18700, 2000],
    grunt6: [21900, 4000],
    grunt7: [27500, 2000],
    grunt8: [30700, 2500],
    grunt9: [34500, 2000]
  }
});

const effects = new Howl({
  src: ['/game/sounds/effects.mp3'],
  preload: true,
  sprite: {
    click: [0, 100],
    take: [200, 100],
    start: [3500, 3000],
    barrel: [7000, 1000],
    walk: [8500, 6000, true],
    eat: [19000, 1000]
  }
});

let isWalkPlaying = false;
const walkSound = new Howl({
  src: ['/game/sounds/walk.mp3'],
  preload: true,
  loop: true
});

const fightSprite = new Howl({
  src: ['/game/sounds/fighting.mp3'],
  preload: true,
  onend: () => {
    isGruntPlaying = false;
  },
  sprite: {
    swoosh0: [320, 350],
    swoosh1: [1000, 350],
    swoosh2: [1900, 450],
    swoosh3: [2800, 400],
    swoosh4: [3700, 500]
  }
});

export const sounds = {
  swing: () => {
    fightSprite.play(`swoosh${getRandomInt(5)}`);
  },
  grunt: () => {
    if (!isGruntPlaying) {
      orcSprite.play(`grunt${getRandomInt(10)}`);
      isGruntPlaying = true;
    }
  },
  walk: {
    play: () => {
      if (!isWalkPlaying) {
        walkSound.play();
        isWalkPlaying = true;
      }
    },
    stop: () => {
      walkSound.stop();
      isWalkPlaying = false;
    }
  },
  effects
};
