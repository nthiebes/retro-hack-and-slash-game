import Resources from './js/utils/Resources.js';
import { Menu } from './js/interface/menu.js';
import { GameData } from './js/gameData.js';
import { getRandomInt } from './js/utils/number.js';

const body = document.getElementsByTagName('body')[0];
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
  'images/races/beastman0.png',
  'images/races/beastman1.png',
  'images/races/beastman2.png',
  'images/races/skeleton0.png',
  'images/races/skeleton1.png',
  'images/races/skeleton2.png',
  'images/races/ghoul0.png',
  'images/races/mummy0.png',
  'images/races/lich0.png',
  'images/races/zombie0.png',
  'images/races/zombie1.png',
  'images/races/zombie2.png',
  'images/races/wounded0.png',
  'images/races/wounded1.png',
  'images/hair/orc/hair0.png',
  'images/hair/orc/hair1.png',
  'images/hair/elf/hair0.png',
  'images/hair/elf/hair1.png',
  'images/hair/elf/hair2.png',
  'images/hair/elf/hair3.png',
  'images/hair/elf/hair4.png',
  'images/hair/elf/hair5.png',
  'images/hair/elf/hair6.png',
  'images/hair/elf/hair7.png',
  'images/hair/elf/hair8.png',
  'images/hair/elf/hair9.png',
  'images/hair/elf/hair10.png',
  'images/hair/elf/hair11.png',
  'images/hair/elf/hair12.png',
  'images/hair/elf/hair13.png',
  'images/hair/elf/hair14.png',
  'images/hair/elf/hair15.png',
  'images/hair/dwarf/hair0.png',
  'images/hair/human/hair0.png',
  'images/hair/human/hair1.png',
  'images/hair/human/hair2.png',
  'images/hair/human/hair3.png',
  'images/hair/human/hair4.png',
  'images/hair/human/hair5.png',
  'images/hair/human/hair6.png',
  'images/hair/human/hair7.png',
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
  'images/hair/beastman/hair0.png',
  'images/hair/skeleton/hair0.png',
  'images/hair/ghoul/hair0.png',
  'images/hair/mummy/hair0.png',
  'images/hair/lich/hair0.png',
  'images/hair/zombie/hair0.png',
  'images/faces/orc/face0.png',
  'images/faces/orc/face1.png',
  'images/faces/orc/face2.png',
  'images/faces/human/face0.png',
  'images/faces/human/face1.png',
  'images/faces/human/face2.png',
  'images/faces/elf/face0.png',
  'images/faces/elf/face1.png',
  'images/faces/dwarf/face0.png',
  'images/faces/dwarf/face1.png',
  'images/faces/dwarf/face2.png',
  'images/faces/dwarf/face3.png',
  'images/faces/dwarf/face4.png',
  'images/faces/dwarf/face5.png',
  'images/faces/dwarf/face6.png',
  'images/faces/dwarf/face7.png',
  'images/faces/dwarf/face8.png',
  'images/faces/dwarf/face9.png',
  'images/faces/dwarf/face10.png',
  'images/faces/dwarf/face11.png',
  'images/faces/vampire/face0.png',
  'images/faces/vampire/face1.png',
  'images/faces/beastman/face0.png',
  'images/faces/skeleton/face0.png',
  'images/faces/ghoul/face0.png',
  'images/faces/mummy/face0.png',
  'images/faces/lich/face0.png',
  'images/faces/zombie/face0.png',
  'images/items/none.png',
  'images/items/sword0.png',
  'images/items/sword1.png',
  'images/items/sword2.png',
  'images/items/sword3.png',
  'images/items/sword4.png',
  'images/items/axe0.png',
  'images/items/axe1.png',
  'images/items/axe2.png',
  'images/items/axe3.png',
  'images/items/axe4.png',
  'images/items/axe5.png',
  'images/items/axe6.png',
  'images/items/club0.png',
  'images/items/shovel0.png',
  'images/items/shield0.png',
  'images/items/shield1.png',
  'images/items/shield2.png',
  'images/items/shield3.png',
  'images/items/shield4.png',
  'images/items/shield5.png',
  'images/items/torso_cloth_0.png',
  'images/items/torso_leather_0.png',
  'images/items/torso_iron_0.png',
  'images/items/torso_steel_0.png',
  'images/items/torso_plate_0.png',
  'images/items/leg_cloth_0.png',
  'images/items/leg_leather_0.png',
  'images/items/leg_iron_0.png',
  'images/items/leg_steel_0.png',
  'images/items/leg_plate_0.png',
  'images/items/head_cloth_0.png',
  'images/items/head_leather_0.png',
  'images/items/head_iron_0.png',
  'images/items/head_steel_0.png',
  'images/items/head_plate_0.png',
  'images/items/head_plate_1.png',
  'images/items/zombie-hands.png',
  'images/items/zombie-foot.png',
  'images/items/zombie-arm.png'
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

      return fetch('data/items.json');
    })
    .then((response) => response.json())
    .then((items) => {
      GameData.setItems(items);

      return fetch('data/races.json');
    })
    .then((response) => response.json())
    .then((races) => {
      GameData.setRaces(races);

      Menu.start(resources);
    });
};

body.style.backgroundImage = `url("./images/bg${getRandomInt(5)}.jpg")`;

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    getGameData();
  });
};
