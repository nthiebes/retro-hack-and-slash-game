export const drawImage = (config) => {
  const tileSize = 32,
    imageNumTiles = 16;

  // Each row
  for (let r = 0; r < config.rowTileCount; r++) {
    // Each column
    for (let c = 0; c < config.colTileCount; c++) {
      const tile = config.array[r][c],
        // eslint-disable-next-line no-bitwise
        tileRow = (tile / imageNumTiles) | 0,
        // eslint-disable-next-line no-bitwise
        tileCol = tile % imageNumTiles | 0;

      config.ctx.drawImage(
        config.tileset,
        tileCol * tileSize,
        tileRow * tileSize,
        tileSize,
        tileSize,
        c * tileSize,
        r * tileSize,
        tileSize,
        tileSize
      );
    }
  }
};

export const drawText = ({ ctx, x, y, text, color }) => {
  ctx.font = '16px sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'start';
  ctx.fillText(text, x, y);
};

export const drawSquare = (config) => {
  config.ctx.fillStyle = config.color;
  config.ctx.beginPath();
  config.ctx.moveTo(config.x, config.y);
  config.ctx.lineTo(config.x + config.width, config.y);
  config.ctx.lineTo(config.x + config.width, config.y + config.width);
  config.ctx.lineTo(config.x, config.y + config.width);
  config.ctx.lineTo(config.x, config.y);
  config.ctx.lineWidth = 1;
  config.ctx.closePath();
  config.ctx.fill();
};

export const getCircle = (x0, y0, radius) => {
  let x = -radius,
    y = 0,
    err = 2 - 2 * radius;
  const fields = [];

  do {
    fields.push([x0 - x, y0 + y]);
    fields.push([x0 - y, y0 - x]);
    fields.push([x0 + x, y0 - y]);
    fields.push([x0 + y, y0 + x]);

    radius = err;
    if (radius <= y) {
      y++;
      err += y * 2 + 1;
    }
    if (radius > x || err > y) {
      x++;
      err += x * 2 + 1;
    }
  } while (x < 0);

  return fields;
};

// Bresenham ray casting algorithm
export const bline = ({ x0, y0, x1, y1, map }) => {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  const fields = [];
  let err = (dx > dy ? dx : -dy) / 2;

  while (true) {
    if (map[y0][x0] === 0 || typeof map[y0][x0] === 'string') {
      fields.push([x0, y0]);
    } else {
      break;
    }
    if (x0 === x1 && y0 === y1) {
      break;
    }
    const e2 = err;

    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }
  }

  return fields;
};

export const uniq = (array) => {
  const seen = {};

  return array.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};
