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

    // eslint-disable-next-line no-param-reassign
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
// eslint-disable-next-line max-params
export const bline = (x0, y0, x1, y1, map) => {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  const fields = [];
  let err = (dx > dy ? dx : -dy) / 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (map[y0] && (map[y0][x0] <= 1 || typeof map[y0][x0] === 'string')) {
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
    // eslint-disable-next-line no-prototype-builtins
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};
