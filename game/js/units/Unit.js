import config from '../config.js';
import { getSpeed } from './helpers.js';
import { GameData } from '../gameData.js';

export default class Unit {
  constructor(data) {
    this.direction = 'RIGHT';
    this.moving = false;
    this.attacking = false;
    this.path = [];
    this.steps = Math.floor((config.fieldWidth / data.speed) * 2);
    this.currentStep = Math.floor((config.fieldWidth / data.speed) * 2);

    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        this[i] = data[i];
      }
    }
  }

  walk() {
    if (config.debug && this.friendly) {
      console.log('👣');
    }

    switch (this.direction) {
      case 'LEFT':
        this.skin.pos = [0, 128];
        this.head.pos = [0, 128];
        this.leg.pos = [0, 128];
        this.torso.pos = [0, 128];
        this.primary.pos = [0, 128];
        this.secondary.pos = [0, 128];
        break;

      default:
        this.skin.pos = [0, 0];
        this.head.pos = [0, 0];
        this.leg.pos = [0, 0];
        this.torso.pos = [0, 0];
        this.primary.pos = [0, 0];
        this.secondary.pos = [0, 0];
    }

    this.skin.frames = [0, 1, 2, 3];
    this.head.frames = [0, 1, 2, 3];
    this.leg.frames = [0, 1, 2, 3];
    this.torso.frames = [0, 1, 2, 3];
    this.primary.frames = [0, 1, 2, 3];
    this.secondary.frames = [0, 1, 2, 3];
    this.moving = true;
  }

  attack() {
    let animationPositionLeft, animationPositionRight;

    if (config.debug && this.friendly) {
      console.log('⚔️');
    }

    switch (this.animation) {
      case 'stab':
        animationPositionLeft = 640;
        animationPositionRight = 512;
        break;

      default:
        animationPositionLeft = 384;
        animationPositionRight = 256;
    }

    switch (this.direction) {
      case 'LEFT':
        this.skin.pos = [0, animationPositionLeft];
        this.head.pos = [0, animationPositionLeft];
        this.leg.pos = [0, animationPositionLeft];
        this.torso.pos = [0, animationPositionLeft];
        this.primary.pos = [0, animationPositionLeft];
        this.secondary.pos = [0, animationPositionLeft];
        break;

      default:
        this.skin.pos = [0, animationPositionRight];
        this.head.pos = [0, animationPositionRight];
        this.leg.pos = [0, animationPositionRight];
        this.torso.pos = [0, animationPositionRight];
        this.primary.pos = [0, animationPositionRight];
        this.secondary.pos = [0, animationPositionRight];
    }

    this.skin.frames = [0, 1, 2];
    this.skin.index = 0;
    this.head.frames = [0, 1, 2];
    this.head.index = 0;
    this.leg.frames = [0, 1, 2];
    this.leg.index = 0;
    this.torso.frames = [0, 1, 2];
    this.torso.index = 0;
    this.primary.frames = [0, 1, 2];
    this.primary.index = 0;
    this.secondary.frames = [0, 1, 2];
    this.secondary.index = 0;
    this.moving = false;
    this.attacking = true;
  }

  stop() {
    if (config.debug && this.friendly) {
      console.log('✋');
    }

    this.moving = false;
    this.attacking = false;
    this.skin.once = false;
    this.skin.done = false;
    // this.head.once = false;
    // this.head.done = false;
    // this.leg.once = false;
    // this.leg.done = false;
    // this.torso.once = false;
    // this.torso.done = false;
    this.turn(this.direction);
    this.skin.frames = [0];
    this.head.frames = [0];
    this.leg.frames = [0];
    this.torso.frames = [0];
    this.primary.frames = [0];
    this.secondary.frames = [0];
  }

  turn(direction) {
    let animationPositionLeft, animationPositionRight;

    if (config.debug && this.friendly) {
      console.log(direction === 'LEFT' ? '👈' : '👉');
    }

    switch (this.animation) {
      case 'stab':
        animationPositionLeft = 640;
        animationPositionRight = 512;
        break;

      default:
        animationPositionLeft = 384;
        animationPositionRight = 256;
    }

    switch (direction.toUpperCase()) {
      case 'LEFT':
        this.skin.pos = [0, animationPositionLeft];
        this.head.pos = [0, animationPositionLeft];
        this.leg.pos = [0, animationPositionLeft];
        this.torso.pos = [0, animationPositionLeft];
        this.primary.pos = [0, animationPositionLeft];
        this.secondary.pos = [0, animationPositionLeft];
        this.direction = 'LEFT';
        break;

      default:
        this.skin.pos = [0, animationPositionRight];
        this.head.pos = [0, animationPositionRight];
        this.leg.pos = [0, animationPositionRight];
        this.torso.pos = [0, animationPositionRight];
        this.primary.pos = [0, animationPositionRight];
        this.secondary.pos = [0, animationPositionRight];
        this.direction = 'RIGHT';
    }
  }

  equip({ id }) {
    const armor = GameData.getArmor(id);
    const weapon = GameData.getWeapon(id);

    if (config.debug) {
      console.log('🛡');
    }

    if (armor) {
      this.gear[armor.gear] = id;
      this[armor.gear].url = `images/armor/${id}.png`;

      const newSpeed = getSpeed({ race: this.race, gear: this.gear });

      this.speed = newSpeed;
      this.skin.speed = newSpeed;
      this.head.speed = newSpeed;
      this.leg.speed = newSpeed;
      this.torso.speed = newSpeed;
      this.primary.speed = newSpeed;
      this.secondary.speed = newSpeed;
    }

    if (weapon) {
      const isTwohanded = weapon.type === 'twohanded';
      const weaponType = isTwohanded ? 'primary' : weapon.type;

      // Drop item in second hand
      if (isTwohanded) {
        this.weapons.secondary = 'fist';
        this.secondary.url = 'images/weapons/fist.png';
      }

      // Don't equip secondary if twohanded
      if (this.weaponType === 'twohanded' && weaponType === 'secondary') {
        return;
      }

      // Order matters!
      this.weapons[weaponType] = id;
      this[weaponType].url = `images/weapons/${id}.png`;
      this.animation = GameData.getWeapon(this.weapons.primary).animation;
      this.weaponType = GameData.getWeapon(this.weapons.primary).type;
      this.stop();
    }
  }
}
