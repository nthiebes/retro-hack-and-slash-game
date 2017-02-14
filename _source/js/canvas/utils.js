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
}
