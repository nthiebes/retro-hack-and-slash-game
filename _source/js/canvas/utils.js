export default class Utils {
  static drawImage(config) {
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
  }

  static drawSquare(config) {
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
  }

  static getPath(cfg) {
    const path = [],
      speed = cfg.speed,
      x1 = cfg.x1,
      y1 = cfg.y1,
      x2 = cfg.x2,
      y2 = cfg.y2,
      x = (x2 - x1) / speed,
      y = (y2 - y1) / speed;
    let lastX = x1,
      lastY = y1;

    for (let i = 0; i <= speed; i++) {
      path.push([lastX, lastY]);
      lastX = lastX + x;
      lastY = lastY + y;
    }

    return path;
  }
}
