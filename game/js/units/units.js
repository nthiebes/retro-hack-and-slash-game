import config from '../config.js';
import { getAttackSpeed, getWalkSpeed } from './utils.js';
import Sprite from '../utils/Sprite.js';
import { getRandomInt } from '../utils/number.js';
import Unit from './Unit.js';
import { GameData } from '../gameData.js';

let listData = [];
let playerId;

export class Units {
  static get list() {
    return listData;
  }

  static set list(list) {
    listData = list;
  }

  static get player() {
    return listData.find(({ id }) => id === playerId);
  }

  static getUnit(unitId) {
    return listData.find(({ id }) => id === unitId);
  }

  static addUnits({ player, players, enemies }) {
    player && this.addUnit(player);
    playerId = playerId || player?.id;

    for (let i = 0; i < players.length; i++) {
      const otherPlayer = players[i];

      if (playerId !== otherPlayer.id) {
        this.addUnit(otherPlayer);
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const unitData = GameData.enemies.list.find(
        ({ id }) => id === enemy.id.split('.')[0]
      );

      this.addUnit({
        ...unitData,
        ...enemy,
        id: enemy.id
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
    const hairCount = GameData.races[unit.race].hair;
    const facesCount = GameData.races[unit.race].faces;
    const skin = Number.isInteger(unit.skin)
      ? unit.skin
      : getRandomInt(skinCount);
    const hair = unit?.cosmetics?.hair
      ? unit.cosmetics.hair
      : `hair${getRandomInt(hairCount)}`;
    const face = unit?.cosmetics?.face
      ? unit.cosmetics.face
      : `face${getRandomInt(facesCount)}`;
    const speed = getWalkSpeed({
      ...unit,
      gear: {
        head,
        torso,
        leg
      }
    });
    const attackSpeed = getAttackSpeed(primary);

    listData.push(
      new Unit(
        {
          ...unit,
          pos: [unit.pos[0] + 0.5, unit.pos[1] + 0.5],
          tile: unit.pos,
          range: GameData.getWeapon(primary).range,
          weaponType: GameData.getWeapon(primary).type,
          speed,
          attackSpeed,
          animation,
          direction: unit.direction,
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
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          head: new Sprite({
            url: `images/items/${head}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          leg: new Sprite({
            url: `images/items/${leg}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          torso: new Sprite({
            url: `images/items/${torso}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          primary: new Sprite({
            url: `images/items/${primary}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          secondary: new Sprite({
            url: `images/items/${secondary}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          special: new Sprite({
            url: 'images/items/none.png',
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          hair: new Sprite({
            url: `images/hair/${unit.race}/${hair}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          }),
          face: new Sprite({
            url: `images/faces/${unit.race}/${face}.png`,
            pos: [0, 256],
            size: [256, 256],
            speed,
            frames: [0]
          })
        },
        config.debug
      )
    );
  }
}
