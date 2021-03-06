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
  'images/armor/head0.png',
  'images/armor/head1.png',
  'images/armor/head2.png',
  'images/armor/head3.png',
  'images/armor/head4.png',
  'images/armor/head5.png',
  'images/armor/leg0.png',
  'images/armor/leg1.png',
  'images/armor/leg2.png',
  'images/armor/leg3.png',
  'images/armor/leg4.png',
  'images/armor/torso0.png',
  'images/armor/torso1.png',
  'images/armor/torso2.png',
  'images/armor/torso3.png',
  'images/armor/torso4.png',
  'images/weapons/fist.png',
  'images/weapons/sword.png',
  'images/weapons/axe.png',
  'images/weapons/spear.png',
  'images/weapons/halberd.png',
  'images/weapons/shield.png'
];
const getGameData = () => {
  fetch('data/maps/items.json')
    .then((response) => response.json())
    .then((json) => {
      gameData.map = json.map;
      gameData.items = json.items;
      gameData.players = json.players;
      gameData.enemies = json.enemies;
      return fetch('data/weapons.json');
    })
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
