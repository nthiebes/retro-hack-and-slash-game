import Sprite from '../utils/sprite';
import Unit from './unit';

export default class Units { 
    constructor(config) {
        this.list = [];
        this.addUnits(config);
    }

    addUnits(config) {
        const keys = Object.keys(config.units);

        for (let i = 0; i < keys.length; i++) {
            const unit = config.units[keys[i]];

            this.list.push(new Unit(Object.assign({}, unit, {
                'id': i + 1,
                'pos': unit.pos,
                'skin': new Sprite({
                    'url': `/images/races/${unit.race}${unit.skin}.png`,
                    'pos': [0, 256],
                    'size': [128, 128],
                    'speed': 4,
                    'frames': [0]
                })
            })));
        }
    }
}
