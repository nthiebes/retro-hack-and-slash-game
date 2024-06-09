import { getRandomInt, getRandomId } from './utils/number.js';

export class GameData {
  static setWeapons(data) {
    this.weaponsData = data;
  }

  static setArmor(data) {
    this.armorData = data;
  }

  static setRaces(data) {
    this.racesData = data;
  }

  static setEnemies(data) {
    this.enemiesData = data;
  }

  static setAnimations(data) {
    this.animationsData = data;
  }

  static setItems(data) {
    this.itemsData = data;
  }

  static get weapons() {
    return this.weaponsData;
  }

  static get armor() {
    return this.armorData;
  }

  static get races() {
    return this.racesData;
  }

  static get enemies() {
    return this.enemiesData;
  }

  static get animations() {
    return this.animationsData;
  }

  static get items() {
    return this.itemsData;
  }

  static getAnimation(id) {
    return this.animationsData.list.find((animation) => animation.id === id);
  }

  static getWeapon(id) {
    return this.weaponsData.list.find((weapon) => weapon.id === id);
  }

  static getArmor(id) {
    return this.armorData.list.find((armor) => armor.id === id);
  }

  static getItem(id) {
    return this.itemsData.find((item) => item.id === id);
  }

  static getRandomItem(id) {
    const eventId = id.split('.')[0];
    let possibleItems = null;

    if (eventId === 'random1') {
      possibleItems = this.armorData.list.filter(
        (item) =>
          item.material === 'cloth' ||
          item.material === 'leather' ||
          item.material === 'iron'
      );
      possibleItems = [
        ...possibleItems,
        ...this.weaponsData.list.filter(
          (item) =>
            item.rarity === 'common' ||
            item.rarity === 'uncommon' ||
            item.rarity === 'rare'
        )
      ];
    }
    if (eventId === 'random2') {
      possibleItems = this.armorData.list.filter(
        (item) =>
          item.material === 'leather' ||
          item.material === 'iron' ||
          item.material === 'steel'
      );
      possibleItems = [
        ...possibleItems,
        ...this.weaponsData.list.filter(
          (item) =>
            item.rarity === 'uncommon' ||
            item.rarity === 'rare' ||
            item.rarity === 'epic'
        )
      ];
    }
    if (eventId === 'random3') {
      possibleItems = this.armorData.list.filter(
        (item) =>
          item.material === 'iron' ||
          item.material === 'steel' ||
          item.material === 'plate'
      );
      possibleItems = [
        ...possibleItems,
        ...this.weaponsData.list.filter(
          (item) =>
            item.rarity === 'rare' ||
            item.rarity === 'epic' ||
            item.rarity === 'legendary'
        )
      ];
    }

    return `${
      possibleItems[getRandomInt(possibleItems.length - 1)].id
    }.${getRandomId()}`;
  }
}
