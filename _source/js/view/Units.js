import config from '../config.js';
import { getSpeed } from '../utils/getSpeed.js';
import Sprite from '../utils/Sprite.js';
import Unit from '../model/Unit.js';
import { GameData } from '../gameData.js';

export default class Units {
  constructor(units) {
    this.list = [];
    this.addUnits(units);
  }

  addUnits(units) {
    const keys = Object.keys(units);

    for (let i = 0; i < keys.length; i++) {
      const unit = units[keys[i]];

      this.list.push(
        new Unit(
          Object.assign({}, unit, {
            pos: [unit.pos[0] + 0.5, unit.pos[1] + 0.5],
            tile: unit.pos,
            range: GameData.weapons[unit.weapons.primary].range,
            speed: getSpeed(unit),
            skin: new Sprite({
              url: `images/races/${unit.race}${unit.skin}.png`,
              pos: [0, 256],
              size: [128, 128],
              speed: getSpeed(unit),
              frames: [0]
            }),
            head: new Sprite({
              url: `images/armor/head${unit.gear.head}.png`,
              pos: [0, 256],
              size: [128, 128],
              speed: getSpeed(unit),
              frames: [0]
            }),
            leg: new Sprite({
              url: `images/armor/leg${unit.gear.leg}.png`,
              pos: [0, 256],
              size: [128, 128],
              speed: getSpeed(unit),
              frames: [0]
            }),
            torso: new Sprite({
              url: `images/armor/torso${unit.gear.torso}.png`,
              pos: [0, 256],
              size: [128, 128],
              speed: getSpeed(unit),
              frames: [0]
            }),
            primary: new Sprite({
              url: `images/weapons/${unit.weapons.primary}.png`,
              pos: [0, 256],
              size: [128, 128],
              speed: getSpeed(unit),
              frames: [0]
            }),
            secondary: new Sprite({
              url: `images/weapons/${unit.weapons.secondary}.png`,
              pos: [0, 256],
              size: [128, 128],
              speed: getSpeed(unit),
              frames: [0]
            })
          }),
          config.debug
        )
      );
    }
  }
}
