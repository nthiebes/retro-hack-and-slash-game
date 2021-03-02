import { drawSquare } from './utils.js';

class Map {
  constructor({ map, units }) {
    this.map = map;

    // Initial unit positions
    for (let i = 0; i < units.length; i++) {
      this.map[Math.floor(units[i].pos[1])][Math.floor(units[i].pos[0])] =
        units[i].id;
    }
  }

  updatePosition({ x, y, newX, newY, unitId }) {
    // Delete old position
    this.map[y][x] = 0;

    // Add new position
    this.map[newY][newX] = unitId;
  }

  showDebugFields({ unit, ctx }) {
    const x = Math.floor(unit.pos[0]),
      y = Math.floor(unit.pos[1]),
      path = unit.path;
    let i = path.length;

    if (!unit.friendly) {
      while (i--) {
        drawSquare({
          ctx: ctx,
          color: 'rgba(0,255,0,0.5)',
          width: 32,
          height: 32,
          x: path[i][0] * 32,
          y: path[i][1] * 32
        });
      }
    }

    for (let r = 0; r < this.map.length; r++) {
      for (let c = 0; c < this.map[0].length; c++) {
        if (this.map[r][c] !== 0) {
          drawSquare({
            ctx: ctx,
            color: 'rgba(0,0,0,0.5)',
            width: 32,
            height: 32,
            x: c * 32,
            y: r * 32
          });
        }
      }
    }

    drawSquare({
      ctx: ctx,
      color: 'rgba(0,0,255,0.5)',
      width: 32,
      height: 32,
      x: x * 32,
      y: y * 32
    });

    if (unit.id === 'player.596026') {
      drawSquare({
        ctx: ctx,
        color: 'rgba(255,0,0,0.5)',
        width: 32,
        height: 32,
        x: (x + 1) * 32,
        y: y * 32
      });
      drawSquare({
        ctx: ctx,
        color: 'rgba(255,0,0,0.5)',
        width: 32,
        height: 32,
        x: (x - 1) * 32,
        y: y * 32
      });
    }
  }
}

export { Map };
