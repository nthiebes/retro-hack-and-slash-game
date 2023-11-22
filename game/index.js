import Resources from './js/utils/Resources.js';
import { Menu } from './js/interface/menu.js';
import { GameData } from './js/gameData.js';

const resources = new Resources();
const resourcesList = [
  'images/tileset.png',
  'images/animations.png',
  'images/races/dwarf0.png',
  'images/races/dwarf1.png',
  'images/races/dwarf2.png',
  'images/races/dwarf3.png',
  'images/races/dwarf4.png',
  'images/races/dwarf5.png',
  'images/races/dwarf6.png',
  'images/races/dwarf7.png',
  'images/races/human0.png',
  'images/races/human1.png',
  'images/races/human2.png',
  'images/races/human3.png',
  'images/races/human4.png',
  'images/races/human5.png',
  'images/races/human6.png',
  'images/races/human7.png',
  'images/races/human8.png',
  'images/races/orc0.png',
  'images/races/orc1.png',
  'images/races/orc2.png',
  'images/races/orc3.png',
  'images/races/orc4.png',
  'images/races/orc5.png',
  'images/races/elf0.png',
  'images/races/elf1.png',
  'images/races/elf2.png',
  'images/races/elf3.png',
  'images/races/elf4.png',
  'images/races/elf5.png',
  'images/races/elf6.png',
  'images/races/elf7.png',
  'images/races/vampire0.png',
  'images/races/vampire1.png',
  'images/races/vampire2.png',
  'images/races/vampire3.png',
  'images/races/ghost0.png',
  'images/races/wounded.png',
  'images/hair/orc/hair0.png',
  'images/hair/orc/hair1.png',
  'images/hair/elf/hair0.png',
  'images/hair/elf/hair1.png',
  'images/hair/elf/hair2.png',
  'images/hair/elf/hair3.png',
  'images/hair/elf/hair4.png',
  'images/hair/elf/hair5.png',
  'images/hair/dwarf/hair0.png',
  'images/hair/human/hair0.png',
  'images/hair/human/hair1.png',
  'images/hair/human/hair2.png',
  'images/hair/human/hair3.png',
  'images/hair/human/hair4.png',
  'images/hair/human/hair5.png',
  'images/hair/dwarf/hair0.png',
  'images/hair/dwarf/hair1.png',
  'images/hair/dwarf/hair2.png',
  'images/hair/dwarf/hair3.png',
  'images/hair/dwarf/hair4.png',
  'images/hair/dwarf/hair5.png',
  'images/hair/vampire/hair0.png',
  'images/hair/vampire/hair1.png',
  'images/hair/vampire/hair2.png',
  'images/hair/vampire/hair3.png',
  'images/hair/vampire/hair4.png',
  'images/hair/vampire/hair5.png',
  'images/faces/orc/face0.png',
  'images/faces/orc/face1.png',
  'images/faces/orc/face2.png',
  'images/faces/human/face0.png',
  'images/faces/human/face1.png',
  'images/faces/elf/face0.png',
  'images/faces/elf/face1.png',
  'images/faces/dwarf/face0.png',
  'images/faces/dwarf/face1.png',
  'images/faces/dwarf/face2.png',
  'images/faces/dwarf/face3.png',
  'images/faces/dwarf/face4.png',
  'images/faces/dwarf/face5.png',
  'images/faces/vampire/face0.png',
  'images/faces/vampire/face1.png',
  'images/items/none.png',
  'images/items/axe0.png',
  'images/items/axe1.png',
  'images/items/club0.png',
  'images/items/none.png',
  //   'images/items/head_cloth_0.png',
  'images/items/head_leather_0.png',
  'images/items/head_iron_0.png',
  //   'images/items/head_steel_0.png',
  'images/items/head_plate_0.png',
  'images/items/head_plate_1.png'
  //   'images/items/leg_iron_0.png',
  //   'images/items/leg_cloth_0.png',
  //   'images/items/leg_leather_0.png',
  //   'images/items/torso_iron_0.png',
  //   'images/items/torso_cloth_0.png',
  //   'images/items/torso_leather_0.png',
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

      return fetch('data/enemies.json');
    })
    .then((response) => response.json())
    .then((enemies) => {
      GameData.setEnemies(enemies);
      return fetch('data/animations.json');
    })
    .then((response) => response.json())
    .then((animations) => {
      GameData.setAnimations(animations);

      return fetch('data/races.json');
    })
    .then((response) => response.json())
    .then((races) => {
      GameData.setRaces(races);

      Menu.start(resources);
    });
};

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    getGameData();
  });
};
