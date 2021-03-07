import Resources from './js/utils/Resources.js';
import { Character } from './js/view/Character.js';
import { GameData } from './js/gameData.js';

const gameData = {};
const resources = new Resources();
const resourcesList = [
  'images/tileset.png',
  'images/races/human0.png',
  'images/races/human1.png',
  'images/races/human2.png',
  'images/races/human4.png',
  'images/races/human5.png',
  'images/races/human6.png',
  'images/races/orc0.png',
  'images/races/orc1.png',
  'images/races/orc2.png',
  'images/races/orc3.png',
  'images/races/elf0.png',
  'images/races/ghost0.png',
  'images/races/vampire0.png',
  'images/races/zombie0.png',
  'images/races/zombie1.png',
  'images/races/zombie2.png',
  'images/races/zombie3.png',
  'images/races/zombie4.png',
  'images/races/zombie5.png',
  'images/races/zombie6.png',
  'images/races/wounded.png',
  'images/armor/none.png',
  'images/armor/head_iron_0.png',
  'images/armor/head_iron_1.png',
  'images/armor/head_cloth_0.png',
  'images/armor/head_steel_0.png',
  'images/armor/leg_iron_0.png',
  'images/armor/leg_cloth_0.png',
  'images/armor/leg_leather_0.png',
  'images/armor/torso_iron_0.png',
  'images/armor/torso_cloth_0.png',
  'images/armor/torso_leather_0.png',
  'images/weapons/fist.png',
  'images/weapons/sword.png',
  'images/weapons/axe.png',
  'images/weapons/spear.png',
  'images/weapons/halberd.png',
  'images/weapons/shield.png',
  'images/weapons/shortbow.png'
];
const getGameData = () => {
  fetch('data/weapons.json')
    .then((response) => response.json())
    .then((weapons) => {
      GameData.setWeapons(weapons);
      return fetch('data/armor.json');
    })
    .then((response) => response.json())
    .then((armor) => {
      GameData.setArmor(armor);
      return fetch('data/races.json');
    })
    .then((response) => response.json())
    .then((races) => {
      gameData.races = races;
      GameData.setRaces(races);
      return fetch('data/enemies.json');
    })
    .then((response) => response.json())
    .then((enemies) => {
      GameData.setEnemies(enemies);

      // eslint-disable-next-line
      const character = new Character({
        gameData,
        resources
      });
    });
};

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    getGameData();
  });
};
