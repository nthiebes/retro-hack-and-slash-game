import utils from './utils.js';

export default class Map {
  constructor(map, units) {
    this.map = map;

    // Initial unit positions
    for (let i = 0; i < units.length; i++) {
      this.map[Math.floor(units[i].pos[1])][
        Math.floor(units[i].pos[0])
      ] = units[i].friendly ? 1 : 2;
    }
  }

  updatePosition({ blocked, x, y, newX, newY }) {
    // Delete old position
    this.map[y][x] = 0;

    // Add new position
    this.map[newY][newX] = blocked ? 2 : 1;
  }

  showDebugFields(config) {
    const x = Math.floor(config.unit.pos[0]),
      y = Math.floor(config.unit.pos[1]),
      path = config.unit.path;
    let i = path.length;

    while (i--) {
      utils.drawSquare({
        ctx: config.ctx,
        color: 'rgba(0,255,0,0.5)',
        width: 32,
        height: 32,
        x: path[i][0] * 32,
        y: path[i][1] * 32
      });
    }

    utils.drawSquare({
      ctx: config.ctx,
      color: 'rgba(0,0,255,0.5)',
      width: 32,
      height: 32,
      x: x * 32,
      y: y * 32
    });

    if (config.unit.id === 'player0') {
      utils.drawSquare({
        ctx: config.ctx,
        color: 'rgba(255,0,0,0.5)',
        width: 32,
        height: 32,
        x: (x + 1) * 32,
        y: y * 32
      });
      utils.drawSquare({
        ctx: config.ctx,
        color: 'rgba(255,0,0,0.5)',
        width: 32,
        height: 32,
        x: (x - 1) * 32,
        y: y * 32
      });
    }

    for (let r = 0; r < this.map.length; r++) {
      for (let c = 0; c < this.map[0].length; c++) {
        if (this.map[r][c] > 0) {
          utils.drawSquare({
            ctx: config.ctx,
            color: 'rgba(0,0,0,0.5)',
            width: 32,
            height: 32,
            x: c * 32,
            y: r * 32
          });
        }
      }
    }
  }
}
