import Sprite from '../utils/sprite';
import Input from '../utils/input';
import Unit from '../unit';

export default class Canvas {
    constructor(config) {
        this.canvasGround1 = document.getElementById('canvas-ground1');
        this.canvasAnim = document.getElementById('canvas-anim');
        this.canvasTop1 = document.getElementById('canvas-top1');
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
        this.units = [];

        this.units.push(new Unit({
            'name': 'Human swordsman',
            'pos': [0, 0],
            'skin': new Sprite({
                'url': '/images/units.png',
                'pos': [0, 256],
                'size': [128, 128],
                'speed': this.playerSpeed,
                'frames': [0]
            })
        }));
        this.drawImage(this.ctxGround1, this.ground1);
        this.main();

        this.canvasTop1.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(e) {
        const player = this.units[0];
        
        if (e.pageX < player.pos[0] * this.fieldWidth && player.direction === 'RIGHT') {
            player.turn('LEFT');
        } else if (e.pageX >= player.pos[0] * this.fieldWidth && player.direction === 'LEFT') {
            player.turn('RIGHT');
        }
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
        const player = this.units[0],
            input = this.input,
            playerSpeed = this.playerSpeed;

        if (input.isDown('S')) {
            player.pos[1] += playerSpeed * delta;
        }

        if (input.isDown('W')) {
            player.pos[1] -= playerSpeed * delta;
        }

        if (input.isDown('A')) {
            player.pos[0] -= playerSpeed * delta;
        }

        if (input.isDown('D')) {
            player.pos[0] += playerSpeed * delta;
        }

        if (input.isDown('S') || input.isDown('W') || input.isDown('A') || input.isDown('D')) {
            player.walk();
        } else if (player.moving) {
            player.stop();
        }
    }
}
