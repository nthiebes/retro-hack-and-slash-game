import Sprite from '../utils/sprite';
import Unit from '../model/Unit';

export default class Units { 
  constructor(config, debug) {
    this.list = [];
    this.addUnits(config, debug);
  }

  addUnits(config, debug) {
    const keys = Object.keys(config.units);

    for (let i = 0; i < keys.length; i++) {
      const unit = config.units[keys[i]];

      this.list.push(new Unit(Object.assign({}, unit, {
        'id': i + 1,
        'pos': unit.pos,
        'primary': config.weapons[unit.weapons.primary],
        'secondary': config.weapons[unit.weapons.secondary],
        'range': config.weapons[unit.weapons.primary].range,
        'skin': new Sprite({
          'url': `/images/races/${unit.race}${unit.skin}.png`,
          'pos': [0, 256],
          'size': [128, 128],
          'speed': this.getSpeed(config, unit),
          'frames': [0]
        })
      }), debug));
    }
  }

  getSpeed(config, unit) {
    return config.races[unit.race].speed;
  }
}
