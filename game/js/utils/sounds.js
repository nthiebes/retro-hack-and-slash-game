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

const swooshSprite = new Howl({
  src: ['/game/sounds/fighting.mp3'],
  preload: true,
  sprite: {
    swoosh0: [320, 350],
    swoosh1: [1000, 350],
    swoosh2: [1900, 450],
    swoosh3: [2800, 400],
    swoosh4: [3700, 500]
  }
});

const hitSprite = new Howl({
  src: ['/game/sounds/hit.mp3'],
  preload: true,
  volume: 0.5,
  sprite: {
    hit0: [100, 300],
    hit1: [480, 350],
    hit2: [880, 350],
    hit3: [1350, 350],
    hit4: [1830, 350],
    hit5: [2330, 450],
    hit6: [2840, 230]
  }
});

const zombieSprite = new Howl({
  src: ['/game/sounds/zombies.mp3'],
  onend: () => {
    isGruntPlaying = false;
  },
  preload: true,
  sprite: {
    die: [0, 800],
    grunt0: [1100, 2600],
    grunt1: [4300, 1100]
  }
});

const skeletonSprite = new Howl({
  src: ['/game/sounds/skeleton.mp3'],
  onend: () => {
    isGruntPlaying = false;
  },
  preload: true,
  sprite: {
    grunt0: [0, 470]
  }
});

let isBattlePlaying = false;
const battle = new Howl({
  src: ['/game/sounds/battle.mp3'],
  preload: true,
  loop: true,
  volume: 0.5,
  onfade: () => {
    battle.stop();
    isBattlePlaying = false;
  }
});

const ambience = new Howl({
  src: ['/game/sounds/ambience.mp3'],
  preload: true,
  loop: true,
  volume: 0 // Disabled for testing
});

const gruntMap = {
  orc: {
    sprite: orcSprite,
    sounds: 10
  },
  zombie: {
    sprite: zombieSprite,
    sounds: 2
  },
  skeleton: {
    sprite: skeletonSprite,
    sounds: 1
  }
};
export const sounds = {
  swing: () => {
    swooshSprite.play(`swoosh${getRandomInt(5)}`);
  },
  hit: () => {
    hitSprite.play(`hit${getRandomInt(7)}`);
  },
  die: () => {
    zombieSprite.play('die');
  },
  aggro: (race = 'orc') => {
    if (!isGruntPlaying) {
      const grunt = gruntMap[race] || {
        sprite: orcSprite,
        sounds: 10
      };

      grunt.sprite.play(`grunt${getRandomInt(grunt.sounds)}`);
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
  effects,
  battle: {
    play: () => {
      if (!isBattlePlaying) {
        sounds.ambience.fadeOut();
        battle.volume(0.75);
        battle.play();
        isBattlePlaying = true;
      }
    },
    stop: () => {
      battle.fade(0.75, 0, 2000);
      isBattlePlaying = false;
      sounds.ambience.fadeIn();
    }
  },
  ambience: {
    fadeIn: () => {
      ambience.fade(0, 1, 1000);
    },
    fadeOut: () => {
      ambience.fade(1, 0, 1000);
    },
    play: () => {
      ambience.play();
    }
  }
};
