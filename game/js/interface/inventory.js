import { GameData } from '../gameData.js';
import { Units } from '../units/units.js';
import { sounds } from '../utils/sounds.js';
import {
  getDefense,
  getWalkSpeed,
  getAttackSpeed,
  getStrength,
  getDexterity,
  getIntelligence
} from '../units/utils.js';
import { racesMap, rarityMap } from './translations.js';
import { Menu } from './menu.js';
import { Statistics } from './statistics.js';
import { getRandomInt } from '../utils/number.js';

const inventoryWindow = document.getElementById('inventory');
const inventoryRaceImg = document.getElementById('inventory-race-preview');
const inventoryFaceImg = document.getElementById('inventory-face-preview');
const inventoryHairImg = document.getElementById('inventory-hair-preview');
const inventoryPrimaryImg = document.getElementById(
  'inventory-primary-preview'
);
const inventorySecondaryImg = document.getElementById(
  'inventory-secondary-preview'
);
const inventoryWoundedImg = document.getElementById(
  'inventory-wounded-preview'
);
const inventoryTorsoImg = document.getElementById('inventory-torso-preview');
const inventoryLegImg = document.getElementById('inventory-leg-preview');
const inventoryHeadImg = document.getElementById('inventory-head-preview');
const inventoryItems = document.getElementById('inventory-items');
const inventorySlotsWrapper = document.getElementById('inventory-slots');
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
const inventoryhealthBar = document.getElementById('inventory-health-bar');
const inventoryhealthNumber = document.getElementById(
  'inventory-health-number'
);
const healthBar = document.getElementById('health-bar-health');
const healthBarNumber = document.getElementById('health-bar-number');
const closeBtn = document.getElementById('close-inventory');
const itemName = document.getElementById('inventory-item-name');
const itemRarity = document.getElementById('inventory-item-rarity');
const itemDescription = document.getElementById('inventory-item-description');
const itemEffect = document.getElementById('inventory-item-effect');

let inventoryOpen = false;

export class Inventory {
  static toggleInventory = () => {
    if (inventoryOpen) {
      Inventory.hide();
      Menu.showBackground();
    } else {
      inventoryOpen = true;
      Inventory.updateInventory();
      Menu.hideBackground();
      Statistics.hide();
      inventoryWindow.classList.add('window--show');
    }

    closeBtn.addEventListener('click', () => {
      Inventory.hide();
      Menu.showBackground();
      sounds.effects.play('click');
    });
  };

  static hide() {
    inventoryOpen = false;
    inventoryWindow.classList.remove('window--show');
  }

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
      noFace,
      health,
      special
    } = Units.player;

    Inventory.resetHover();
    inventoryRaceImg.style.backgroundImage = `url(/game/${skin.url})`;
    inventoryFaceImg.style.backgroundImage = `url(/game/${
      noFace ? 'images/hair/human/hair0.png' : face.url
    })`;
    inventoryHairImg.style.backgroundImage = `url(/game/${
      noHair ? 'images/hair/human/hair0.png' : hair.url
    })`;
    inventoryPrimaryImg.style.backgroundImage = `url(/game/${primary.url})`;
    inventorySecondaryImg.style.backgroundImage = `url(/game/${secondary.url})`;
    inventoryWoundedImg.style.backgroundImage = `url(/game/${special.url})`;
    inventoryHeadImg.style.backgroundImage = `url(/game/${head.url})`;
    inventoryTorsoImg.style.backgroundImage = `url(/game/${torso.url})`;
    inventoryLegImg.style.backgroundImage = `url(/game/${leg.url})`;
    inventoryItems.innerHTML = '';
    inventorySlots.forEach((slot) => {
      slot.style.backgroundImage = '';
      slot.className = 'inventory__item';
    });
    inventorySlotsWrapper.addEventListener(
      'mouseover',
      Inventory.handleItemHover
    );
    inventoryName.innerHTML = name;
    inventoryRace.innerHTML = racesMap[race].name;
    inventoryDamage.innerHTML = Inventory.roundStat(getStrength(Units.player));
    inventoryDefense.innerHTML = Inventory.roundStat(getDefense(Units.player));
    inventoryRange.innerHTML = range;
    inventoryDexterity.innerHTML = getDexterity(Units.player);
    inventoryIntelligence.innerHTML = getIntelligence(Units.player);
    inventoryCombatspeed.innerHTML = Inventory.roundStat(
      getAttackSpeed(weapons.primary)
    );
    inventoryWalkspeed.innerHTML = Inventory.roundStat(
      getWalkSpeed({ race, gear })
    );
    inventoryhealthNumber.innerHTML = `${Math.floor(health)} / 1000`;
    inventoryhealthBar.style.width = `${Math.floor(health) / 10}%`;
    healthBarNumber.innerHTML = `${Math.floor(health)} / 1000`;
    healthBar.style.width = `${Math.floor(health) / 10}%`;

    // console.log(inventory);
    // const existingItems = {};
    // let uniqInventory = [...inventory];

    // uniqInventory.forEach((item) => {
    //   const id = item.id.split('.')[0];

    //   existingItems[id] = existingItems[id] ? existingItems[id] + 1 : 1;
    // });

    // console.log(existingItems);

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

      if (item.equipped) {
        const itemInSlot = document.getElementById(`inventory-${item.slot}`);

        itemInSlot.style.backgroundImage = backgroundImage;
        itemInSlot.className = className;
        itemInSlot.setAttribute('data-id', item.id);
        itemInSlot.addEventListener('click', Inventory.handleItemSlotClick);
      } else {
        li.setAttribute('data-id', item.id);
        inventoryItems.append(li);
        inventoryItems.addEventListener('click', Inventory.handleItemClick);
        inventoryItems.addEventListener('mouseover', Inventory.handleItemHover);
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
    itemName.innerHTML = '';
    itemDescription.innerHTML = '';
    itemRarity.innerHTML = '';
    itemRarity.className = 'inventory__item-rarity';
    itemEffect.innerHTML = '';
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
    Inventory.updateInventory();
    event.target.setAttribute('data-id', '');
    sounds.effects.play('take');
  };

  static handleItemClick = (event) => {
    const itemId = event.target.getAttribute('data-id');

    if (!itemId) {
      return;
    }

    const id = itemId.split('.')[0];
    const armor = GameData.getArmor(id);
    const weapon = GameData.getWeapon(id);

    if (armor || weapon) {
      Units.player.equipItem(itemId);
      Inventory.updateInventory();
      sounds.effects.play('take');
      return;
    }

    const item = GameData.getItem(id);

    switch (item?.type) {
      case 'consumable': {
        if (item.health && item.damage) {
          if (getRandomInt(3) === 0) {
            Units.player.takeDamage(item.damage);
          } else {
            Units.player.heal(item.health);
          }
        } else if (item.damage) {
          Units.player.takeDamage(item.damage);
        } else if (item.health) {
          Units.player.heal(item.health);
        }
        if (item.zombie && getRandomInt(100) <= item.zombie) {
          Units.player.changeRace('zombie');
        }

        if (item.id.includes('mushroom')) {
          Units.player.stats.mushrooms++;
          sounds.effects.play('eat');
        }
        if (item.id.includes('berries')) {
          Units.player.stats.berries++;
          sounds.effects.play('eat');
        }
        if (item.id.includes('zombie')) {
          Units.player.stats.zombieMeat++;
          sounds.effects.play('eat');
        }
        Units.player.removeFromInventory(itemId);
        break;
      }
      case 'misc': {
        if (item.messages) {
          // eslint-disable-next-line no-alert
          alert(item.messages[getRandomInt(item.messages.length)]);
        }
        break;
      }
      default: {
        //
      }
    }

    Inventory.updateInventory();
  };

  static handleItemHover = (event) => {
    const itemId = event.target.getAttribute('data-id');

    if (!itemId) {
      Inventory.resetHover();
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

    itemName.innerHTML = item.name;
    itemRarity.innerHTML = item.rarity ? rarityMap[item.rarity] : '';
    itemRarity.className = `inventory__item-rarity inventory__item-rarity--${item.rarity}`;
    itemDescription.innerHTML = item.description || item.set || '';
    if (item.damage && item.health) {
      // eslint-disable-next-line max-len
      itemEffect.innerHTML = `Heilt <b class="inventory__item--health">${item.health}</b> Lebenspunkte oder fügt <b class="inventory__item--damage">${item.damage}</b> Schaden zu.`;
    } else if (item.health) {
      itemEffect.innerHTML = `Heilt <b class="inventory__item--health">${item.health}</b> Lebenspunkte.`;
    }

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
        inventoryDamageHover.innerHTML = `+${Inventory.roundStat(
          strength - currentStrength
        )}`;
        inventoryDamageHover.classList.add('inventory__stat--plus');
      } else if (strength < currentStrength) {
        inventoryDamageHover.innerHTML = `-${Inventory.roundStat(
          currentStrength - strength
        )}`;
        inventoryDamageHover.classList.add('inventory__stat--minus');
      }
      if (attackSpeed > currentAttackSpeed) {
        inventoryCombatspeedHover.innerHTML = `+${Inventory.roundStat(
          attackSpeed - currentAttackSpeed
        )}`;
        inventoryCombatspeedHover.classList.add('inventory__stat--plus');
      } else if (attackSpeed < currentAttackSpeed) {
        inventoryCombatspeedHover.innerHTML = `-${Inventory.roundStat(
          currentAttackSpeed - attackSpeed
        )}`;
        inventoryCombatspeedHover.classList.add('inventory__stat--minus');
      }
      if (range > currentRange) {
        inventoryRangeHover.innerHTML = `+${Inventory.roundStat(
          range - currentRange
        )}`;
        inventoryRangeHover.classList.add('inventory__stat--plus');
      } else if (range < currentRange) {
        inventoryRangeHover.innerHTML = `-${Inventory.roundStat(
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
        inventoryDefenseHover.innerHTML = `+${Inventory.roundStat(
          defense - currentDefense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--plus');
      } else if (defense < currentDefense) {
        inventoryDefenseHover.innerHTML = `-${Inventory.roundStat(
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
        inventoryDefenseHover.innerHTML = `+${Inventory.roundStat(
          defense - currentDefense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--plus');
      } else if (defense < currentDefense) {
        inventoryDefenseHover.innerHTML = `-${Inventory.roundStat(
          currentDefense - defense
        )}`;
        inventoryDefenseHover.classList.add('inventory__stat--minus');
      }
      if (walkSpeed > currentWalkSpeed) {
        inventoryWalkspeedHover.innerHTML = `+${Inventory.roundStat(
          walkSpeed - currentWalkSpeed
        )}`;
        inventoryWalkspeedHover.classList.add('inventory__stat--plus');
      } else if (walkSpeed < currentWalkSpeed) {
        inventoryWalkspeedHover.innerHTML = `-${Inventory.roundStat(
          currentWalkSpeed - walkSpeed
        )}`;
        inventoryWalkspeedHover.classList.add('inventory__stat--minus');
      }
    }
  };

  static roundStat = (value) => {
    return Math.round(value * 100) / 100;
  };
}
