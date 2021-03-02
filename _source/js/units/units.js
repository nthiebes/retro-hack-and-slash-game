import config from '../config.js';
import { getSpeed } from './helpers.js';
import Sprite from '../utils/Sprite.js';
import Unit from './Unit.js';
import { GameData } from '../gameData.js';

export class Units {
  static get list() {
    return this.listData;
  }

  static get player() {
    return this.listData[0];
  }

  static addUnits(units) {
    const keys = Object.keys(units);

    this.listData = [];

    for (let i = 0; i < keys.length; i++) {
      const unit = units[keys[i]];

      this.addUnit(unit);
    }
  }

  static addUnit(unit) {
    const speed = getSpeed(unit);

    this.listData.push(
      new Unit(
        {
          ...unit,
          pos: [unit.pos[0] + 0.5, unit.pos[1] + 0.5],
          tile: unit.pos,
          range: GameData.weapons[unit.weapons.primary].range,
          speed,
          skin: new Sprite({
            url: `images/races/${unit.race}${unit.skin}.png`,
            pos: [0, 256],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          head: new Sprite({
            url: `images/armor/${unit.gear.head}.png`,
            pos: [0, 256],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          leg: new Sprite({
            url: `images/armor/${unit.gear.leg}.png`,
            pos: [0, 256],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          torso: new Sprite({
            url: `images/armor/${unit.gear.torso}.png`,
            pos: [0, 256],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          primary: new Sprite({
            url: `images/weapons/${unit.weapons.primary}.png`,
            pos: [0, 256],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          secondary: new Sprite({
            url: `images/weapons/${unit.weapons.secondary}.png`,
            pos: [0, 256],
            size: [128, 128],
            speed,
            frames: [0]
          })
        },
        config.debug
      )
    );
  }
}
