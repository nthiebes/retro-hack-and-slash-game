import globalConfig from '../config.js';

export const drawImage = (config) => {
  // Each row
  for (let r = 0; r < config.rowTileCount; r++) {
    // Each column
    for (let c = 0; c < config.colTileCount; c++) {
      const tile = config.array[r][c],
        // eslint-disable-next-line no-bitwise
        tileRow = (tile / globalConfig.imageNumTiles) | 0,
        // eslint-disable-next-line no-bitwise
        tileCol = tile % globalConfig.imageNumTiles | 0;

      config.ctx.drawImage(
        config.tileset,
        tileCol * globalConfig.tileSize,
        tileRow * globalConfig.tileSize,
        globalConfig.tileSize,
        globalConfig.tileSize,
        c * (config.fieldWidth || globalConfig.fieldWidth),
        r * (config.fieldWidth || globalConfig.fieldWidth),
        config.fieldWidth || globalConfig.fieldWidth,
        config.fieldWidth || globalConfig.fieldWidth
      );
    }
  }
};

export const drawText = ({ ctx, x, y, text, color }) => {
  ctx.font =
    '18px "Sang Sang Flower", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000';
  ctx.textAlign = 'center';
  ctx.strokeText(text, x, y);
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
