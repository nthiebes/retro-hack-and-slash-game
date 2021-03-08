import { drawSquare, getCircle, uniq, bline } from './utils.js';
import config from '../config.js';

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

  getFieldsInSight(pos, range = config.visibility) {
    const posX = Math.floor(pos[0]);
    const posY = Math.floor(pos[1]);
    const newFields = [];
    let visibleFields = [];
    let fieldsInSight = [];

    // Collect circle tiles for each range
    for (let l = 1; l <= range; l++) {
      fieldsInSight = fieldsInSight.concat(getCircle(posX, posY, l));
    }

    // Fill gaps
    for (let i = 0; i < fieldsInSight.length; i++) {
      const y = fieldsInSight[i][0],
        x = fieldsInSight[i][1];

      if (x > posY) {
        newFields.push([y, x - 1]);
      }

      if (x < posY) {
        newFields.push([y, x + 1]);
      }
    }

    // Remove tiles that are out of the map
    fieldsInSight = fieldsInSight.filter(
      (field) => field[0] >= 0 && field[1] >= 0
    );

    // Merge the new array
    fieldsInSight = fieldsInSight.concat(newFields);

    // Remove duplicates
    fieldsInSight = uniq(fieldsInSight);

    // Remove fields that are out of the viewport
    for (let j = 0; j < fieldsInSight.length; j++) {
      visibleFields = visibleFields.concat(
        bline(posX, posY, fieldsInSight[j][0], fieldsInSight[j][1], this.map)
      );
    }

    // Remove duplicates
    visibleFields = uniq(visibleFields);

    return visibleFields;
  }

  showDebugFields({ unit, ctx }) {
    const x = Math.floor(unit.pos[0]),
      y = Math.floor(unit.pos[1]),
      path = unit.path,
      fieldsInSight = unit.fieldsInSight;
    let i = path.length;
    let j = fieldsInSight.length;

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

    if (!unit.friendly) {
      while (j--) {
        drawSquare({
          ctx: ctx,
          color: 'rgba(255,0,0,0.2)',
          width: 32,
          height: 32,
          x: fieldsInSight[j][0] * 32,
          y: fieldsInSight[j][1] * 32
        });
      }
    }

    for (let r = 0; r < this.map.length; r++) {
      for (let c = 0; c < this.map[0].length; c++) {
        if (this.map[r][c] === 2) {
          drawSquare({
            ctx: ctx,
            color: 'rgba(0,0,0,0.5)',
            width: 32,
            height: 32,
            x: c * 32,
            y: r * 32
          });
        }
        if (this.map[r][c] === 1) {
          drawSquare({
            ctx: ctx,
            color: 'rgba(255,255,255,0.5)',
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
