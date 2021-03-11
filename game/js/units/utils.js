import config from '../config.js';
import { GameData } from '../gameData.js';

const getDefense = (defender) => {
  const defense =
    GameData.getWeapon(defender.weapons.secondary).defense +
    GameData.races[defender.race].defense;
  const headGearType = GameData.getArmor(defender.gear.head).type;
  const torsoGearType = GameData.getArmor(defender.gear.torso).type;
  const legGearType = GameData.getArmor(defender.gear.leg).type;
  const headDefense = GameData.armor.types[headGearType].defense;
  const torsoDefense = GameData.armor.types[torsoGearType].defense;
  const legDefense = GameData.armor.types[legGearType].defense;

  return defense + headDefense + torsoDefense + legDefense;
};
const fight = (attacker, defender) => {
  const strength =
    GameData.getWeapon(attacker.weapons.primary).damage +
    GameData.races[attacker.race].strength;
  const defense = getDefense(defender);
  // const attackerDexterity = GameData.races[attacker.race].dexterity;
  // const defenderDexterity = GameData.races[defender.race].dexterity;
  const modifier = (strength - defense) * 7;
  const damage = 30 + modifier;
  const newHealth = defender.health - damage;

  // console.log('🤺', strength, ' vs ', defense);
  // console.log(attackerDexterity, ' vs ', defenderDexterity);

  defender.health = newHealth < 0 ? 0 : newHealth;

  if (defender.health === 0) {
    defender.die();
  } else {
    defender.takeDamage();
  }
};

export const combat = ({ units, map, attacker }) => {
  const player = units.player;

  // Check for hits
  units.list.forEach((unit) => {
    if (unit.dead && attacker.id !== player.id) {
      attacker.stop();
    }

    if (
      unit.id !== attacker.id &&
      !unit.dead &&
      !(!attacker.friendly && !unit.friendly)
    ) {
      const playerPosX = Math.round(config.fieldWidth * attacker.pos[0]),
        enemyPosX = Math.round(config.fieldWidth * unit.pos[0]),
        playerPosY = Math.round(config.fieldWidth * attacker.pos[1]),
        enemyPosY = Math.round(config.fieldWidth * unit.pos[1]),
        playerWidth = 40,
        playerHeight = 50;

      // Consider unit height
      if (
        playerPosY > enemyPosY - playerHeight / 2 &&
        playerPosY < enemyPosY + playerHeight / 2
      ) {
        if (attacker.direction === 'LEFT') {
          const playerReach = playerPosX - playerWidth - attacker.range * 10;

          if (playerReach <= enemyPosX && playerPosX > enemyPosX) {
            fight(attacker, unit);
          }
        }
        if (attacker.direction === 'RIGHT') {
          const playerReach = playerPosX + playerWidth + attacker.range * 10;

          if (playerReach >= enemyPosX && playerPosX < enemyPosX) {
            fight(attacker, unit);
          }
        }
      }
    }
  });

  // Clear blocked field for dead units
  units.list.forEach((unit) => {
    if (unit.dead && unit.id !== player.id) {
      const x = Math.floor(unit.pos[0]);
      const y = Math.floor(unit.pos[1]);

      map.resetPosition({ x, y });
    } else if (unit.dead) {
      console.log('player dead');
    }
  });
};

export const getSpeed = ({ race, gear }) => {
  const headGearType = GameData.getArmor(gear.head).type;
  const torsoGearType = GameData.getArmor(gear.torso).type;
  const legGearType = GameData.getArmor(gear.leg).type;
  const headSpeedModifier = GameData.armor.types[headGearType].speedModifier;
  const torsoSpeedModifier = GameData.armor.types[torsoGearType].speedModifier;
  const legSpeedModifier = GameData.armor.types[legGearType].speedModifier;
  const speedModifier =
    1 - headSpeedModifier - torsoSpeedModifier - legSpeedModifier;

  return GameData.races[race].speed * speedModifier;
};
