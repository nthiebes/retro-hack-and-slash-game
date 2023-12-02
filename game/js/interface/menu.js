import '../../../node_modules/socket.io-client/dist/socket.io.min.js';

import Canvas from '../canvas/Canvas.js';
import { GameData } from '../gameData.js';
import { socket } from '../utils/socket.js';
import { Units } from '../units/units.js';
import {
  getDefense,
  getWalkSpeed,
  getAttackSpeed,
  getStrength,
  getDexterity,
  getIntelligence
} from '../units/utils.js';
import { attributesMap, racesMap } from './translations.js';

const mapField = document.getElementById('map');
const nameField = document.getElementById('name');
const menuNew = document.getElementById('menu-new');
const menuJoin = document.getElementById('menu-join');
const menuWindow = document.getElementById('menu');
const newWindow = document.getElementById('new');
const inventoryWindow = document.getElementById('inventory');
const nextRaceBtn = document.getElementById('race-next');
const prevRaceBtn = document.getElementById('race-prev');
const nextSkinBtn = document.getElementById('skin-next');
const prevSkinBtn = document.getElementById('skin-prev');
const nextHairBtn = document.getElementById('hair-next');
const prevHairBtn = document.getElementById('hair-prev');
const nextFaceBtn = document.getElementById('face-next');
const prevFaceBtn = document.getElementById('face-prev');
const closeBtn = document.getElementById('close-window');
const characterWindow = document.getElementById('character');
const raceImg = document.getElementById('race-preview');
const faceImg = document.getElementById('face-preview');
const hairImg = document.getElementById('hair-preview');
const inventoryRaceImg = document.getElementById('inventory-race-preview');
const inventoryFaceImg = document.getElementById('inventory-face-preview');
const inventoryHairImg = document.getElementById('inventory-hair-preview');
const inventoryPrimaryImg = document.getElementById(
  'inventory-primary-preview'
);
const inventorySecondaryImg = document.getElementById(
  'inventory-secondary-preview'
);
const inventoryTorsoImg = document.getElementById('inventory-torso-preview');
const inventoryLegImg = document.getElementById('inventory-leg-preview');
const inventoryHeadImg = document.getElementById('inventory-head-preview');
const inventoryItems = document.getElementById('inventory-items');
const inventorySlots = document.querySelectorAll(
  '.inventory__slots .inventory__item'
);
const inventoryName = document.getElementById('inventory-name');
const inventoryRace = document.getElementById('inventory-race');
const inventoryDamage = document.getElementById('inventory-damage');
const inventoryDefense = document.getElementById('inventory-defense');
const inventoryRange = document.getElementById('inventory-range');
const inventoryCombatspeed = document.getElementById('inventory-combatspeed');
const inventoryWalkspeed = document.getElementById('inventory-walkspeed');
const inventoryDexterity = document.getElementById('inventory-dexterity');
const inventoryIntelligence = document.getElementById('inventory-intelligence');
const inventoryDamageHover = document.getElementById('inventory-damage-hover');
const inventoryDefenseHover = document.getElementById(
  'inventory-defense-hover'
);
const inventoryRangeHover = document.getElementById('inventory-range-hover');
const inventoryCombatspeedHover = document.getElementById(
  'inventory-combatspeed-hover'
);
const inventoryWalkspeedHover = document.getElementById(
  'inventory-walkspeed-hover'
);
const inventoryPrimaryIcon = document.getElementById('inventory-primary');
const inventorySecondaryIcon = document.getElementById('inventory-secondary');
const inventoryHeadIcon = document.getElementById('inventory-head');
const inventoryTorsoIcon = document.getElementById('inventory-torso');
const inventoryLegIcon = document.getElementById('inventory-leg');
const inventoryJewleryIcon = document.getElementById('inventory-jewlery');
const raceAttributes = document.getElementById('race-attributes');
const raceName = document.getElementById('race-name');
const raceCounter = document.getElementById('race-count');
const skinCounter = document.getElementById('skin-count');
const hairCounter = document.getElementById('hair-count');
const faceCounter = document.getElementById('face-count');
const canvasWrapper = document.getElementById('canvas-wrapper');
const minimap = document.getElementById('minimap');
const healthBar = document.getElementById('health-bar');
const healthBarNumber = document.getElementById('health-bar-number');

let inventoryOpen = false;

export class Menu {
  static start = (resources) => {
    Menu.resources = resources;
    Menu.races = Object.entries(GameData.races).filter(
      (race) => race[0] !== 'zombie'
    );
    Menu.currentRace = 0;
    Menu.player = {
      id: null,
      friendly: true,
      name: nameField.value,
      direction: 'RIGHT',
      health: 1000,
      gear: {
        head: 'none',
        torso: 'none',
        leg: 'none'
      },
      weapons: {
        primary: 'none',
        secondary: 'none'
      }
    };

    menuNew.addEventListener('click', Menu.selectMap);
    menuJoin.addEventListener('click', Menu.showCharacterEditor);
    newWindow.addEventListener('submit', Menu.createGame);

    // Connect player
    socket.emit('id', ({ playerId, gameId }) => {
      Menu.player.id = playerId;

      if (gameId) {
        menuJoin.removeAttribute('disabled');
      } else {
        menuNew.removeAttribute('disabled');
      }
    });

    // Server disconnects
    socket.on('disconnect', () => {
      window.location.reload();
    });
  };

  static selectMap() {
    menuWindow.classList.remove('window--show');
    newWindow.classList.add('window--show');
  }

  static createGame = (event) => {
    event.preventDefault();

    socket.emit('new-game', {
      mapId: mapField.value
    });

    newWindow.classList.add('window--show');

    Menu.showCharacterEditor();
  };

  static showCharacterEditor() {
    Menu.setRaceAttributes(Menu.races[0]);

    nextRaceBtn.addEventListener('click', Menu.handleNextRace);
    prevRaceBtn.addEventListener('click', Menu.handlePrevRace);
    nextSkinBtn.addEventListener('click', Menu.handleNextSkin);
    prevSkinBtn.addEventListener('click', Menu.handlePrevSkin);
    nextHairBtn.addEventListener('click', Menu.handleNextHair);
    prevHairBtn.addEventListener('click', Menu.handlePrevHair);
    nextFaceBtn.addEventListener('click', Menu.handleNextFace);
    prevFaceBtn.addEventListener('click', Menu.handlePrevFace);
    closeBtn.addEventListener('click', () => {
      Menu.toggleInventory();
    });
    characterWindow.addEventListener('submit', Menu.joinGame);

    newWindow.classList.remove('window--show');
    characterWindow.classList.add('window--show');

    raceCounter.innerHTML = `1 / ${Menu.races.length}`;
    Menu.resetCounters();
  }

  static resetCounters = () => {
    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;
    const hairCount = GameData.races[race].hair;
    const faceCount = GameData.races[race].faces;

    skinCounter.innerHTML = `1 / ${skinCount}`;
    faceCounter.innerHTML = `1 / ${faceCount}`;
    hairCounter.innerHTML = `1 / ${hairCount}`;

    Menu.currentSkin = 0;
    Menu.currentFace = 0;
    Menu.currentHair = 0;

    raceImg.style.backgroundImage = `url(/game/images/races/${race}${Menu.currentSkin}.png)`;
    faceImg.style.backgroundImage = `url(/game/images/faces/${race}/face${Menu.currentFace}.png)`;
    hairImg.style.backgroundImage = `url(/game/images/hair/${race}/hair${Menu.currentHair}.png)`;
  };

  static handleNextRace = () => {
    if (!Menu.races[Menu.currentRace + 1]) {
      Menu.currentRace = -1;
    }

    const race = Menu.races[Menu.currentRace + 1];

    raceCounter.innerHTML = `${Menu.currentRace + 2} / ${Menu.races.length}`;
    Menu.setRaceAttributes(race);
    raceImg.style.backgroundImage = `url(/game/images/races/${race[0]}0.png)`;
    Menu.currentRace++;
    Menu.resetCounters();
  };

  static handlePrevRace = () => {
    if (!Menu.races[Menu.currentRace - 1]) {
      Menu.currentRace = Menu.races.length;
    }

    const race = Menu.races[Menu.currentRace - 1];

    raceCounter.innerHTML = `${Menu.currentRace} / ${Menu.races.length}`;
    Menu.setRaceAttributes(race);
    raceImg.style.backgroundImage = `url(/game/images/races/${race[0]}0.png)`;
    Menu.currentRace--;
    Menu.resetCounters();
  };

  static handleNextSkin = () => {
    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;

    if (Menu.currentSkin === skinCount - 1) {
      Menu.currentSkin = -1;
    }

    Menu.currentSkin++;
    skinCounter.innerHTML = `${Menu.currentSkin + 1} / ${skinCount}`;
    raceImg.style.backgroundImage = `url(/game/images/races/${race}${Menu.currentSkin}.png)`;
  };

  static handlePrevSkin = () => {
    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;

    if (Menu.currentSkin === 0) {
      Menu.currentSkin = skinCount;
    }

    Menu.currentSkin--;
    skinCounter.innerHTML = `${Menu.currentSkin + 1} / ${skinCount}`;
    raceImg.style.backgroundImage = `url(/game/images/races/${race}${Menu.currentSkin}.png)`;
  };

  static handleNextFace = () => {
    const race = Menu.races[Menu.currentRace][0];
    const faceCount = GameData.races[race].faces;

    if (Menu.currentFace === faceCount - 1) {
      Menu.currentFace = -1;
    }

    Menu.currentFace++;
    faceCounter.innerHTML = `${Menu.currentFace + 1} / ${faceCount}`;
    faceImg.style.backgroundImage = `url(/game/images/faces/${race}/face${Menu.currentFace}.png)`;
  };

  static handlePrevFace = () => {
    const race = Menu.races[Menu.currentRace][0];
    const faceCount = GameData.races[race].faces;

    if (Menu.currentFace === 0) {
      Menu.currentFace = faceCount;
    }

    Menu.currentFace--;
    faceCounter.innerHTML = `${Menu.currentFace + 1} / ${faceCount}`;
    faceImg.style.backgroundImage = `url(/game/images/faces/${race}/face${Menu.currentFace}.png)`;
  };

  static handleNextHair = () => {
    const race = Menu.races[Menu.currentRace][0];
    const hairCount = GameData.races[race].hair;

    if (Menu.currentHair === hairCount - 1) {
      Menu.currentHair = -1;
    }

    Menu.currentHair++;
    hairCounter.innerHTML = `${Menu.currentHair + 1} / ${hairCount}`;
    hairImg.style.backgroundImage = `url(/game/images/hair/${race}/hair${Menu.currentHair}.png)`;
  };

  static handlePrevHair = () => {
    const race = Menu.races[Menu.currentRace][0];
    const hairCount = GameData.races[race].hair;

    if (Menu.currentHair === 0) {
      Menu.currentHair = hairCount;
    }

    Menu.currentHair--;
    hairCounter.innerHTML = `${Menu.currentHair + 1} / ${hairCount}`;
    hairImg.style.backgroundImage = `url(/game/images/hair/${race}/hair${Menu.currentHair}.png)`;
  };

  static setRaceAttributes = (race) => {
    const attributes = Object.entries(race[1]).filter(
      (attribute) =>
        attribute[0] !== 'skins' &&
        attribute[0] !== 'faces' &&
        attribute[0] !== 'hair'
    );

    raceAttributes.innerHTML = '';
    raceName.innerHTML = racesMap[race[0]];
    attributes.forEach((attribute) => {
      const li = document.createElement('li');
      const attributeValue = attribute[1];
      const attributeData = attributesMap[attribute[0]];

      if (attributeValue > attributeData.average + 1) {
        li.classList.add('attribute--good');
        li.append(attributeData.best);
        raceAttributes.append(li);
      } else if (attributeValue > attributeData.average) {
        li.classList.add('attribute--good');
        li.append(attributeData.good);
        raceAttributes.append(li);
      } else if (attributeValue < attributeData.average) {
        li.classList.add('attribute--bad');
        li.append(attributeData.bad);
        raceAttributes.append(li);
      }
    });
  };

  static toggleInventory = () => {
    if (inventoryOpen) {
      inventoryOpen = false;
    } else {
      inventoryOpen = true;
      Menu.updateInventory();
    }

    inventoryWindow.classList.toggle('window--show');
    canvasWrapper.classList.toggle('window--focussed');
    minimap.classList.toggle('window--focussed');
    healthBar.classList.toggle('window--focussed');
  };

  static updateInventory = () => {
    const {
      name,
      race,
      skin,
      face,
      hair,
      weapons,
      primary,
      secondary,
      head,
      leg,
      torso,
      gear,
      range,
      inventory,
      noHair,
      noFace
    } = Units.player;

    Menu.resetHover();
    inventoryRaceImg.style.backgroundImage = `url(/game/${skin.url})`;
    inventoryFaceImg.style.backgroundImage = `url(/game/${
      noFace ? 'images/hair/human/hair0.png' : face.url
    })`;
    inventoryHairImg.style.backgroundImage = `url(/game/${
      noHair ? 'images/hair/human/hair0.png' : hair.url
    })`;
    inventoryPrimaryImg.style.backgroundImage = `url(/game/${primary.url})`;
    inventorySecondaryImg.style.backgroundImage = `url(/game/${secondary.url})`;
    inventoryHeadImg.style.backgroundImage = `url(/game/${head.url})`;
    inventoryTorsoImg.style.backgroundImage = `url(/game/${torso.url})`;
    inventoryLegImg.style.backgroundImage = `url(/game/${leg.url})`;
    inventoryItems.innerHTML = '';
    inventorySlots.forEach((slot) => {
      slot.style.backgroundImage = '';
      slot.className = 'inventory__item';
    });
    inventoryName.innerHTML = name;
    inventoryRace.innerHTML = racesMap[race];
    inventoryDamage.innerHTML = Menu.roundStat(getStrength(Units.player));
    inventoryDefense.innerHTML = Menu.roundStat(getDefense(Units.player));
    inventoryRange.innerHTML = range;
    inventoryDexterity.innerHTML = getDexterity(Units.player);
    inventoryIntelligence.innerHTML = getIntelligence(Units.player);
    inventoryCombatspeed.innerHTML = Menu.roundStat(
      getAttackSpeed(weapons.primary)
    );
    inventoryWalkspeed.innerHTML = Menu.roundStat(getWalkSpeed({ race, gear }));

    inventory.forEach((item) => {
      const li = document.createElement('li');
      const backgroundImage = `url(/game/images/items/${
        item.id.split('.')[0]
      }.png)`;
      const className = `inventory__item inventory__item--${
        item.rarity || item.type
      }`;

      li.className = className;
      li.style.backgroundImage = backgroundImage;
      li.title = item.name;

      if (item.equipped) {
        const itemInSlot = document.getElementById(`inventory-${item.slot}`);

        itemInSlot.style.backgroundImage = backgroundImage;
        itemInSlot.className = className;
        itemInSlot.title = item.name;
        itemInSlot.setAttribute('data-id', item.id);
        itemInSlot.addEventListener('click', Menu.handleItemSlotClick);
      } else {
        li.setAttribute('data-id', item.id);
        inventoryItems.append(li);
        inventoryItems.addEventListener('click', Menu.handleItemClick);
        inventoryItems.addEventListener('mouseover', Menu.handleItemHover);
      }
    });
  };

  static resetHover = () => {
    inventoryDamageHover.innerHTML = '';
    inventoryDamageHover.className = 'inventory__stat';
    inventoryDefenseHover.innerHTML = '';
    inventoryDefenseHover.className = 'inventory__stat';
    inventoryCombatspeedHover.innerHTML = '';
    inventoryCombatspeedHover.className = 'inventory__stat';
    inventoryWalkspeedHover.innerHTML = '';
    inventoryWalkspeedHover.className = 'inventory__stat';
    inventoryRangeHover.innerHTML = '';
    inventoryRangeHover.className = 'inventory__stat';
    inventoryPrimaryIcon.classList.remove('inventory__item--highlighted');
    inventorySecondaryIcon.classList.remove('inventory__item--highlighted');
    inventoryHeadIcon.classList.remove('inventory__item--highlighted');
    inventoryTorsoIcon.classList.remove('inventory__item--highlighted');
    inventoryLegIcon.classList.remove('inventory__item--highlighted');
    inventoryJewleryIcon.classList.remove('inventory__item--highlighted');
  };

  static handleItemSlotClick = (event) => {
    const itemId = event.target.getAttribute('data-id');

    Units.player.unequipItem(itemId);
    Menu.updateInventory();
    event.target.title = '';
    event.target.setAttribute('data-id', '');
  };

  static handleItemClick = (event) => {
    const itemId = event.target.getAttribute('data-id');
    const id = itemId.split('.')[0];
    const armor = GameData.getArmor(id);
    const weapon = GameData.getWeapon(id);

    if (armor || weapon) {
      Units.player.equipItem(itemId);
      Menu.updateInventory();
    }
  };

  static handleItemHover = (event) => {
    const itemId = event.target.getAttribute('data-id');

    if (!itemId) {
      Menu.resetHover();
      return;
    }

    const player = Units.player;
    const item = player.inventory.find(({ id }) => id === itemId);
    const id = itemId.split('.')[0];
    const currentStrength = getStrength(player);
    const currentDefense = getDefense(player);
    const currentAttackSpeed = getAttackSpeed(player.weapons.primary);
    const currentWalkSpeed = getWalkSpeed({
      race: player.race,
      gear: player.gear
    });
    const currentRange = player.range;
    const armor = GameData.getArmor(id);
    const weapon = GameData.getWeapon(id);

    if (weapon && weapon.type === 'primary') {
      const strength = getStrength({
        ...player,
        weapons: {
          [item.slot]: id
        }
      });
      const attackSpeed = getAttackSpeed(id);
      const range = weapon.range;
      document
        .getElementById(`inventory-${weapon.type}`)
        .classList.add('inventory__item--highlighted');

      if (strength > currentStrength) {
        inventoryDamageHover.innerHTML = `+${Menu.roundStat(
          strength - currentStrength
        )}`;
        inventoryDamageHover.classList.add('inventory__stat--plus');
      } else if (strength < currentStrength) {
        inventoryDamageHover.innerHTML = `-${Menu.roundStat(
          currentStrength - strength
        )}`;
        inventoryDamageHover.classList.add('inventory__stat--minus');
      }
      if (attackSpeed > currentAttackSpeed) {
        inventoryCombatspeedHover.innerHTML = `+${Menu.roundStat(
          attackSpeed - currentAttackSpeed
        )}`;
        inventoryCombatspeedHover.classList.add('inventory__stat--plus');
      } else if (attackSpeed < currentAttackSpeed) {
        inventoryCombatspeedHover.innerHTML = `-${Menu.roundStat(
          currentAttackSpeed - attackSpeed
        )}`;
        inventoryCombatspeedHover.classList.add('inventory__stat--minus');
      }
      if (range > currentRange) {
        inventoryRangeHover.innerHTML = `+${Menu.roundStat(
          range - currentRange
        )}`;
        inventoryRangeHover.classList.add('inventory__stat--plus');
      } else if (range < currentRange) {
        inventoryRangeHover.innerHTML = `-${Menu.roundStat(
          currentRange - range
        )}`;
        inventoryRangeHover.classList.add('inventory__stat--minus');
      }
    } else if (weapon) {
      const defense = getDefense({
        ...player,
        weapons: {
          ...player.weapons,
          secondary: id
        }
      });
      document
        .getElementById(`inventory-${weapon.type}`)
        .classList.add('inventory__item--highlighted');

      if (defense > currentDefense) {
        inventoryDefenseHover.innerHTML = `+${Menu.roundStat(
          defense - currentDefense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--plus');
      } else if (defense < currentDefense) {
        inventoryDefenseHover.innerHTML = `-${Menu.roundStat(
          currentDefense - defense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--minus');
      }
    } else if (armor) {
      const defense = getDefense({
        ...player,
        gear: {
          ...player.gear,
          [item.slot]: id
        }
      });
      const walkSpeed = getWalkSpeed({
        race: player.race,
        gear: {
          ...player.gear,
          [item.slot]: id
        }
      });
      document
        .getElementById(`inventory-${item.slot}`)
        .classList.add('inventory__item--highlighted');

      if (defense > currentDefense) {
        inventoryDefenseHover.innerHTML = `+${Menu.roundStat(
          defense - currentDefense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--plus');
      } else if (defense < currentDefense) {
        inventoryDefenseHover.innerHTML = `-${Menu.roundStat(
          currentDefense - defense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--minus');
      }
      if (walkSpeed > currentWalkSpeed) {
        inventoryWalkspeedHover.innerHTML = `+${Menu.roundStat(
          walkSpeed - currentWalkSpeed
        )}`;
        inventoryWalkspeedHover.classList.add('inventory__stat--plus');
      } else if (walkSpeed < currentWalkSpeed) {
        inventoryWalkspeedHover.innerHTML = `-${Menu.roundStat(
          currentWalkSpeed - walkSpeed
        )}`;
        inventoryWalkspeedHover.classList.add('inventory__stat--minus');
      }
    }
  };

  static roundStat = (value) => {
    return Math.round(value * 100) / 100;
  };

  static joinGame = (event) => {
    event.preventDefault();

    const race = Menu.races[Menu.currentRace][0];
    Menu.player = {
      ...Menu.player,
      race,
      skin: Menu.currentSkin,
      cosmetics: {
        face: `face${Menu.currentFace}`,
        hair: `hair${Menu.currentHair}`
      }
    };

    socket.emit(
      'join-game',
      {
        player: Menu.player
      },
      ({ map, events, players, enemies, mapTransitions, animations }) => {
        // eslint-disable-next-line
        const game = new Canvas({
          map,
          events,
          players,
          enemies,
          mapEvents: mapTransitions,
          animations,
          resources: Menu.resources,
          player: {
            ...Menu.player,
            pos: players.find(({ id }) => Menu.player.id === id).pos
          }
        });

        menuWindow.classList.remove('window--show');
        characterWindow.classList.remove('window--show');
        minimap.classList.add('minimap--show');
        healthBar.classList.add('health-bar--show');
        healthBarNumber.innerHTML = `${Menu.player.health}/${Menu.player.health}`;
      }
    );
  };
}

//   static loadMap = () => {
//     fetch(`/game/data/maps/${Menu.mapId}.json`)
//       .then((response) => response.json())
//       .then((json) => {
//         const gameData = {
//           map: json.map,
//           events: json.events || [],
//           players: json.players || [],
//           enemies: json.enemies || [],
//           mapEvents: json.maps || [],
//           animations: json.animations || []
//         };
//       });
//   };
