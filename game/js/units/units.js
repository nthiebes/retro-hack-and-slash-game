import config from '../config.js';
import { getSpeed } from './utils.js';
import Sprite from '../utils/Sprite.js';
import { getRandomInt } from '../utils/number.js';
import Unit from './Unit.js';
import { GameData } from '../gameData.js';

const listData = [];

export class Units {
  static get list() {
    return listData;
  }

  static get player() {
    return listData[0];
  }

  static addUnits({ player, enemies }) {
    this.addUnit(player);

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const unitData = GameData.enemies.list.find(({ id }) => id === enemy.id);

      this.addUnit({
        ...unitData,
        pos: enemy.pos,
        id: `enemy.${i}`
      });
    }
  }

  static addUnit(unit) {
    let head = unit.gear.head;
    let torso = unit.gear.torso;
    let leg = unit.gear.leg;
    let primary = unit.weapons.primary;
    let secondary = unit.weapons.secondary;

    if (Array.isArray(head)) {
      head = head[getRandomInt(head.length)];
    }
    if (Array.isArray(torso)) {
      torso = torso[getRandomInt(torso.length)];
    }
    if (Array.isArray(leg)) {
      leg = leg[getRandomInt(leg.length)];
    }
    if (Array.isArray(primary)) {
      primary = primary[getRandomInt(primary.length)];
    }
    if (Array.isArray(secondary)) {
      secondary = secondary[getRandomInt(secondary.length)];
    }

    const animation = GameData.getWeapon(primary).animation;
    const skinCount = GameData.races[unit.race].skins;
    const skin = Number.isInteger(unit.skin)
      ? unit.skin
      : getRandomInt(skinCount - 1);
    const speed = getSpeed({
      ...unit,
      gear: {
        head,
        torso,
        leg
      }
    });
    const direction = getRandomInt(2) === 1 ? 'LEFT' : 'RIGHT';
    const directionOffset = direction === 'LEFT' ? 128 : 0;

    listData.push(
      new Unit(
        {
          ...unit,
          pos: [unit.pos[0] + 0.5, unit.pos[1] + 0.5],
          tile: unit.pos,
          range: GameData.getWeapon(primary).range,
          weaponType: GameData.getWeapon(primary).type,
          speed,
          animation,
          direction,
          gear: {
            head,
            torso,
            leg
          },
          weapons: {
            primary,
            secondary
          },
          skin: new Sprite({
            url: `images/races/${unit.race}${skin}.png`,
            pos: [0, 256 + directionOffset],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          head: new Sprite({
            url: `images/armor/${head}.png`,
            pos: [0, 256 + directionOffset],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          leg: new Sprite({
            url: `images/armor/${leg}.png`,
            pos: [0, 256 + directionOffset],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          torso: new Sprite({
            url: `images/armor/${torso}.png`,
            pos: [0, 256 + directionOffset],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          primary: new Sprite({
            url: `images/weapons/${primary}.png`,
            pos: [0, 256 + directionOffset],
            size: [128, 128],
            speed,
            frames: [0]
          }),
          secondary: new Sprite({
            url: `images/weapons/${secondary}.png`,
            pos: [0, 256 + directionOffset],
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
