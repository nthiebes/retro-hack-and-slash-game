import { GameData } from '../gameData.js';

export const getSpeed = (unit) =>
  GameData.races[unit.race].speed * GameData.armor[unit.armor].speedModifier;
