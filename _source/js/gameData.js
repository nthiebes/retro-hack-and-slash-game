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

  static get weapons() {
    return this.weaponsData;
  }

  static get armor() {
    return this.armorData;
  }

  static get races() {
    return this.racesData;
  }
}
