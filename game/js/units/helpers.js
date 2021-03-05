import { GameData } from '../gameData.js';

export const getSpeed = ({ race, gear }) => {
  const headGearType = GameData.armor.list.find((item) => item.id === gear.head)
    .type;
  const torsoGearType = GameData.armor.list.find(
    (item) => item.id === gear.torso
  ).type;
  const legGearType = GameData.armor.list.find((item) => item.id === gear.leg)
    .type;
  const headSpeedModifier = GameData.armor.types[headGearType].speedModifier;
  const torsoSpeedModifier = GameData.armor.types[torsoGearType].speedModifier;
  const legSpeedModifier = GameData.armor.types[legGearType].speedModifier;
  const speedModifier =
    1 - headSpeedModifier - torsoSpeedModifier - legSpeedModifier;

  return GameData.races[race].speed * speedModifier;
};
