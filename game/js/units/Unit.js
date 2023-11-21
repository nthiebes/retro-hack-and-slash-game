import config from '../config.js';
import { getAttackSpeed, getWalkSpeed } from './utils.js';
import { GameData } from '../gameData.js';

export default class Unit {
  constructor(data) {
    this.direction = 'RIGHT';
    this.moving = false;
    this.attacking = false;
    this.dead = false;
    this.path = [];
    this.fieldsInSight = [];
    this.attackSpeed = 0;
    this.speed = data.speed;
    this.target = null;
    this.inventory = [];
    this.steps = Math.floor((config.fieldWidth / data.speed) * 2);
    this.currentStep = Math.floor((config.fieldWidth / data.speed) * 2);

    for (const i in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(i)) {
        this[i] = data[i];
      }
    }
  }

  walk() {
    const directionOffset = 0;

    if (config.debug && this.friendly) {
      console.log('🚶‍♂️');
    }

    this.skin.speed = this.speed;
    this.head.speed = this.speed;
    this.torso.speed = this.speed;
    this.leg.speed = this.speed;
    this.primary.speed = this.speed;
    this.secondary.speed = this.speed;
    this.special.speed = this.speed;
    this.hair.speed = this.speed;
    this.face.speed = this.speed;
    this.skin.pos = [0, directionOffset];
    this.head.pos = [0, directionOffset];
    this.leg.pos = [0, directionOffset];
    this.torso.pos = [0, directionOffset];
    this.primary.pos = [0, directionOffset];
    this.secondary.pos = [0, directionOffset];
    this.special.pos = [0, directionOffset];
    this.hair.pos = [0, directionOffset];
    this.face.pos = [0, directionOffset];
    this.skin.frames = [0, 1, 2, 3];
    this.head.frames = [0, 1, 2, 3];
    this.leg.frames = [0, 1, 2, 3];
    this.torso.frames = [0, 1, 2, 3];
    this.primary.frames = [0, 1, 2, 3];
    this.secondary.frames = [0, 1, 2, 3];
    this.special.frames = [0, 1, 2, 3];
    this.hair.frames = [0, 1, 2, 3];
    this.face.frames = [0, 1, 2, 3];
    this.moving = true;
  }

  attack() {
    let directionOffset;

    if (config.debug) {
      console.log('⚔️');
    }

    switch (this.animation) {
      case 'stab':
        // directionOffset = 512;
        break;

      default:
        directionOffset = 256;
    }

    this.skin.speed = this.attackSpeed;
    this.head.speed = this.attackSpeed;
    this.torso.speed = this.attackSpeed;
    this.leg.speed = this.attackSpeed;
    this.primary.speed = this.attackSpeed;
    this.secondary.speed = this.attackSpeed;
    this.special.speed = this.attackSpeed;
    this.hair.speed = this.attackSpeed;
    this.face.speed = this.attackSpeed;
    this.skin.pos = [0, directionOffset];
    this.head.pos = [0, directionOffset];
    this.leg.pos = [0, directionOffset];
    this.torso.pos = [0, directionOffset];
    this.primary.pos = [0, directionOffset];
    this.secondary.pos = [0, directionOffset];
    this.special.pos = [0, directionOffset];
    this.hair.pos = [0, directionOffset];
    this.face.pos = [0, directionOffset];
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
    this.special.frames = [0, 1, 2];
    this.special.index = 0;
    this.hair.frames = [0, 1, 2];
    this.hair.index = 0;
    this.face.frames = [0, 1, 2];
    this.face.index = 0;
    this.moving = false;
    this.attacking = true;
    this.skin.once = false;
  }

  takeDamage() {
    const directionOffset = 512;

    if (config.debug) {
      console.log('💘');
    }

    if (this.attacking) {
      return;
    }

    this.skin.pos = [0, directionOffset];
    this.head.pos = [0, directionOffset];
    this.torso.pos = [0, directionOffset];
    this.leg.pos = [0, directionOffset];
    this.primary.pos = [0, directionOffset];
    this.secondary.pos = [0, directionOffset];
    this.special.pos = [0, directionOffset];
    this.hair.pos = [0, directionOffset];
    this.face.pos = [0, directionOffset];
    this.skin.once = true;
    this.skin.frames = [0, 0];
    this.skin.index = 0;
    this.head.frames = [0, 0];
    this.head.index = 0;
    this.torso.frames = [0, 0];
    this.torso.index = 0;
    this.leg.frames = [0, 0];
    this.leg.index = 0;
    this.primary.frames = [0, 0];
    this.primary.index = 0;
    this.secondary.frames = [0, 0];
    this.secondary.index = 0;
    this.special.frames = [0, 0];
    this.special.index = 0;
    this.hair.frames = [0, 0];
    this.hair.index = 0;
    this.face.frames = [0, 0];
    this.face.index = 0;
  }

  die() {
    const directionOffset = 512;

    if (config.debug) {
      console.log('😵');
    }

    this.skin.pos = [0, directionOffset];
    this.head.pos = [0, directionOffset];
    this.torso.pos = [0, directionOffset];
    this.leg.pos = [0, directionOffset];
    this.primary.pos = [0, directionOffset];
    this.secondary.pos = [0, directionOffset];
    this.special.pos = [0, directionOffset];
    this.hair.pos = [0, directionOffset];
    this.face.pos = [0, directionOffset];
    this.skin.frames = [0, 1];
    this.skin.index = 0;
    this.head.frames = [0, 1];
    this.head.index = 0;
    this.torso.frames = [0, 1];
    this.torso.index = 0;
    this.leg.frames = [0, 1];
    this.leg.index = 0;
    this.primary.frames = [0, 1];
    this.primary.index = 0;
    this.secondary.frames = [0, 1];
    this.secondary.index = 0;
    this.special.frames = [0, 1];
    this.special.index = 0;
    this.hair.frames = [0, 1];
    this.hair.index = 0;
    this.face.frames = [0, 1];
    this.face.index = 0;
    this.dead = true;
    this.attacking = false;
    this.skin.stay = true;
    this.head.stay = true;
    this.torso.stay = true;
    this.leg.stay = true;
    this.primary.stay = true;
    this.secondary.stay = true;
    this.special.stay = true;
    this.hair.stay = true;
    this.face.stay = true;
  }

  stop() {
    if (config.debug && this.friendly) {
      console.log('✋');
    }

    this.moving = false;
    this.attacking = false;
    this.skin.once = false;
    this.turn(this.direction);
    this.skin.frames = [0];
    this.head.frames = [0];
    this.leg.frames = [0];
    this.torso.frames = [0];
    this.primary.frames = [0];
    this.secondary.frames = [0];
    this.special.frames = [0];
    this.hair.frames = [0];
    this.face.frames = [0];
  }

  turn(direction) {
    let animationPositionRight;

    if (config.debug && this.friendly) {
      console.log(direction === 'LEFT' ? '👈' : '👉');
    }

    switch (this.animation) {
      case 'stab':
        // animationPositionRight = 512;
        break;

      default:
        animationPositionRight = 256;
    }

    this.skin.pos = [0, animationPositionRight];
    this.head.pos = [0, animationPositionRight];
    this.leg.pos = [0, animationPositionRight];
    this.torso.pos = [0, animationPositionRight];
    this.primary.pos = [0, animationPositionRight];
    this.secondary.pos = [0, animationPositionRight];
    this.special.pos = [0, animationPositionRight];
    this.hair.pos = [0, animationPositionRight];
    this.face.pos = [0, animationPositionRight];
    this.direction = direction;
  }

  takeItem(event) {
    const id = event.id.split('.')[0];
    const armor = GameData.getArmor(id);
    const weapon = GameData.getWeapon(id);
    let item;

    if (config.debug) {
      console.log('👜');
    }

    if (armor) {
      item = {
        type: 'armor',
        slot: armor.gear,
        id: event.id,
        equipped: this.gear[armor.gear] === 'none'
      };
    } else if (weapon) {
      item = {
        type: 'weapon',
        slot: weapon.type,
        id: event.id,
        equipped: this.weapons[weapon.type] === 'none'
      };
    } else {
      console.log(item);
    }

    if (item.equipped) {
      this.equipItem(item);
    }

    this.addToInventory(item);
  }

  equipItem = (item) => {
    const id = item.id.split('.')[0];
    const armor = GameData.getArmor(id);
    const weapon = GameData.getWeapon(id);

    if (armor) {
      this.gear[armor.gear] = id;
      this[armor.gear].url = `images/items/${id}.png`;

      const newSpeed = getWalkSpeed({ race: this.race, gear: this.gear });

      this.speed = newSpeed;
      this.skin.speed = newSpeed;
      this.head.speed = newSpeed;
      this.leg.speed = newSpeed;
      this.torso.speed = newSpeed;
      this.primary.speed = newSpeed;
      this.secondary.speed = newSpeed;
      this.special.speed = newSpeed;
      this.hair.speed = newSpeed;
      this.face.speed = newSpeed;
    }

    if (weapon) {
      const isTwohanded = weapon.type === 'twohanded';
      const weaponType = isTwohanded ? 'primary' : weapon.type;

      // Drop item in second hand
      if (isTwohanded) {
        this.weapons.secondary = 'none';
        this.secondary.url = 'images/items/none.png';
      }

      // Don't equip secondary if twohanded
      if (this.weaponType === 'twohanded' && weaponType === 'secondary') {
        return;
      }

      // Order matters!
      this.weapons[weaponType] = id;
      this[weaponType].url = `images/items/${id}.png`;
      this.attackSpeed = getAttackSpeed(this.weapons.primary);
      this.animation = GameData.getWeapon(this.weapons.primary).animation;
      this.weaponType = GameData.getWeapon(this.weapons.primary).type;
      this.range = GameData.getWeapon(this.weapons.primary).range;
      this.stop();
    }
  };

  addToInventory = (item) => {
    this.inventory.push(item);

    console.log('inventory', this.inventory);
  };

  isPlayerInSight = (playerPos) => {
    const playerX = Math.floor(playerPos[0]);
    const playerY = Math.floor(playerPos[1]);

    return this.fieldsInSight.find(
      (pos) => pos[0] === playerX && pos[1] === playerY
    );
  };

  wound = () => {
    this.special.url = 'images/races/wounded.png';
  };
}
