export default class Utils { 
    static drawImage(config) {
        const tileSize = 32,
            imageNumTiles = 16;

        // Each row
        for (let r = 0; r < config.rowTileCount; r++) {
            // Each column
            for (let c = 0; c < config.colTileCount; c++) {
                const tile = config.array[r][c],
                    tileRow = (tile / imageNumTiles) | 0,
                    tileCol = (tile % imageNumTiles) | 0;

                config.ctx.drawImage(config.tileset, tileCol * tileSize, tileRow * tileSize, tileSize, tileSize, c * tileSize, r * tileSize, tileSize, tileSize);
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
}
