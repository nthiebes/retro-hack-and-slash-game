import utils from './utils';

export default class Map {
    constructor(map) {
        this.map = map;
    }

    setUnitPosition(config) {
        const x = Math.floor(config.unit.pos[0]),
            y = Math.floor(config.unit.pos[1]);

        if (config.debug) {
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(0,0,0,0.5)',
                'width': 32,
                'height': 32,
                'x': x * 32,
                'y': y * 32
            });
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(0,0,0,0.5)',
                'width': 32,
                'height': 32,
                'x': (x + 1) * 32,
                'y': y * 32
            });
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(0,0,0,0.5)',
                'width': 32,
                'height': 32,
                'x': (x + 1) * 32,
                'y': (y + 1) * 32,
            });
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(0,0,0,0.5)',
                'width': 32,
                'height': 32,
                'x': x * 32,
                'y': (y + 1) * 32,
            });
        }
    }
}
