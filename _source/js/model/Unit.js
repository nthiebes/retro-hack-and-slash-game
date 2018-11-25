import config from '../config.js';

export default class Unit { 
  constructor(data) {
    this.direction = 'RIGHT';
    this.moving = false;
    this.attacking = false;
    this.path = [];
    this.currentStep = this.speed;

    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        this[i] = data[i];
      }
    }
  }

  walk() {
    if (config.debug) {
      console.log('👣');
    }

    switch (this.direction) {
      case 'LEFT':
        this.skin.pos = [0, 128];
        break;

      default:
        this.skin.pos = [0, 0];
    }

    this.skin.frames = [0, 1, 2, 3];
    this.moving = true;
  }

  attack() {
    if (config.debug) {
      console.log('⚔');
    }

    switch (this.direction) {
      case 'LEFT':
        this.skin.pos = [0, 384];
        break;

      default:
        this.skin.pos = [0, 256];
    }

    this.skin.frames = [0, 1, 2];
    this.skin.index = 0;
    this.moving = false;
    this.attacking = true;
  }

  stop() {
    if (config.debug) {
      console.log('✋');
    }

    this.moving = false;
    this.attacking = false;
    this.skin.once = false;
    this.skin.done = false;
    this.turn(this.direction);
    this.skin.frames = [0];
  }

  turn(direction) {
    if (config.debug) {
      console.log(direction === 'LEFT' ? '↩' : '↪');
    }

    switch (direction.toUpperCase()) {
      case 'LEFT':
        this.skin.pos = [0, 384];
        this.direction = 'LEFT';
        break;

      default:
        this.skin.pos = [0, 256];
        this.direction = 'RIGHT';
    }
  }
}
