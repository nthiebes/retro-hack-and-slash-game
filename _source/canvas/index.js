import Sprite from '../utils/sprite';
import Input from '../utils/input';

export default class Canvas {
    constructor(config) {
        this.canvasGround1 = document.getElementById('canvas-ground1');
        this.canvasAnim = document.getElementById('canvas-anim');
        this.ctxGround1 = this.canvasGround1.getContext('2d');
        this.ctxAnim = this.canvasAnim.getContext('2d');
        this.ground1 = config.map[0];
        this.rowTileCount = this.ground1.length;
        this.colTileCount = this.ground1[0].length;
        this.fieldWidth = 32;
        this.resources = config.resources;
        this.input = new Input();
        this.tileset = this.resources.get('/images/tileset.png');
        this.lastTime = Date.now();
        this.gameTime = 0;
        this.playerSpeed = 4;
        this.units = [{
            'name': 'Human swordsman',
            'pos': [0, 0],
            'skin': new Sprite({
                'url': '/images/units.png',
                'pos': [0, 256],
                'size': [128, 128],
                'speed': 0,
                'frames': [0]
            })
        }];
        this.player = this.units[0];

        this.drawImage(this.ctxGround1, this.ground1);
        this.main();
    }

    drawImage(ctx, array) {
        const tileSize = 32,
            imageNumTiles = 16;

        // Each row
        for (let r = 0; r < this.rowTileCount; r++) {
            // Each column
            for (let c = 0; c < this.colTileCount; c++) {
                const tile = array[r][c],
                    tileRow = (tile / imageNumTiles) | 0,
                    tileCol = (tile % imageNumTiles) | 0;

                ctx.drawImage(this.tileset, tileCol * tileSize, tileRow * tileSize, tileSize, tileSize, c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }

    main() {
        const now = Date.now(),
            delta = (now - this.lastTime) / 1000.0;

        this.update(delta);
        this.render();

        this.lastTime = now;

        window.requestAnimFrame(this.main.bind(this));
    }


    update(delta) {
        this.gameTime += delta;

        this.handleInput(delta);
        this.updateEntities(delta);
    }

    updateEntities(delta) {
        let unit;

        for (let i = 0; i < this.units.length; i++) {
            unit = this.units[i];
            unit.skin.update(delta);
        }
    }

    render() {
        // Clear canvas hack
        this.canvasAnim.width = this.canvasAnim.width;
        this.renderEntities(this.units);
    }

    renderEntities(list) {
        for (let i = 0; i < list.length; i++) {
            // Unit gear
            this.renderEntity(list[i], list[i].skin);
        }
    }

    renderEntity(unit, ...args) {
        this.ctxAnim.save();
        this.ctxAnim.translate(
            (unit.pos[0] * this.fieldWidth),
            (unit.pos[1] * this.fieldWidth)
        );

        for (let i = 0; i < args.length; i++) {
            args[i].render(this.ctxAnim, this.resources);
        }
        this.ctxAnim.restore();
    }

    handleInput(delta) {
        if (this.input.isDown('DOWN') || this.input.isDown('s')) {
            this.player.pos[1] += this.playerSpeed * delta;
        }

        if (this.input.isDown('UP') || this.input.isDown('w')) {
            this.player.pos[1] -= this.playerSpeed * delta;
        }

        if (this.input.isDown('LEFT') || this.input.isDown('a')) {
            this.player.pos[0] -= this.playerSpeed * delta;
        }

        if (this.input.isDown('RIGHT') || this.input.isDown('d')) {
            this.player.pos[0] += this.playerSpeed * delta;
        }
    }
}
