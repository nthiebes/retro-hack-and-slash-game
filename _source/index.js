import Resources from './js/utils/Resources.js';
import { Editor } from './js/view/Editor.js';

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
  'images/weapons/shield.png'
];
const getGameData = () => {
  fetch('data/maps/demo.json')
    .then((response) => response.json())
    .then((json) => {
      gameData.map = json.map;
      gameData.itemPositions = json.itemPositions;
      return fetch('data/weapons.json');
    })
    .then((response) => response.json())
    .then((weapons) => {
      gameData.weapons = weapons;
      return fetch('data/armor.json');
    })
    .then((response) => response.json())
    .then((armor) => {
      gameData.armor = armor;
      return fetch('data/races.json');
    })
    .then((response) => response.json())
    .then((races) => {
      gameData.races = races;
      return fetch('data/units.json');
    })
    .then((response) => response.json())
    .then((units) => {
      gameData.units = units;

      // eslint-disable-next-line
      const editor = new Editor({
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
