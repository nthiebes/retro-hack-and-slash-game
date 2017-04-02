import utils from './utils';
import server from '../server';

export default class Map {
    constructor(map, units) {
        this.map = map;

        // Initial unit positions
        for (let i = 0; i < units.length; i++) {
            this.map[units[i].pos[1]][units[i].pos[0]] = units[i].id;
        }
    }

    updatePosition(config) {
        // Delete old position
        this.map[config.y][config.x] = 0;

        // Add new position
        this.map[config.newY][config.newX] = config.id;

        // server.emit('move', config);
    }

    showDebugFields(config) {
        const x = Math.floor(config.unit.pos[0]),
            y = Math.floor(config.unit.pos[1]),
            path = config.unit.path;
        let i = path.length;

        while (i--) {
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(0,255,0,0.5)',
                'width': 32,
                'height': 32,
                'x': path[i][0] * 32,
                'y': path[i][1] * 32
            });
        }

        utils.drawSquare({
            'ctx': config.ctx,
            'color': 'rgba(0,0,255,0.5)',
            'width': 32,
            'height': 32,
            'x': x * 32,
            'y': y * 32
        });

        if (config.unit.id === 1) {
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(255,0,0,0.5)',
                'width': 32,
                'height': 32,
                'x': (x + 1) * 32,
                'y': y * 32
            });
            utils.drawSquare({
                'ctx': config.ctx,
                'color': 'rgba(255,0,0,0.5)',
                'width': 32,
                'height': 32,
                'x': (x - 1) * 32,
                'y': y * 32
            });
        }
    }
}
