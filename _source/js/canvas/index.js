import Sprite from '../utils/sprite';
import Input from '../utils/input';
import Unit from '../unit';
import utils from './utils';

export default class Canvas {
    constructor(config) {
        this.wrapper = document.getElementById('canvas-wrapper');
        this.canvasGround1 = document.getElementById('canvas-ground1');
        this.canvasGround2 = document.getElementById('canvas-ground2');
        this.canvasAnim = document.getElementById('canvas-anim');
        this.canvasTop1 = document.getElementById('canvas-top1');
        this.ctxGround1 = this.canvasGround1.getContext('2d');
        this.ctxGround2 = this.canvasGround2.getContext('2d');
        this.ctxAnim = this.canvasAnim.getContext('2d');
        this.ctxTop1 = this.canvasTop1.getContext('2d');
        this.ground1 = config.map[0];
        this.ground2 = config.map[1];
        this.top1 = config.map[2];
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
        this.offsetX = 0;
        this.offsetY = 0;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.units.push(new Unit({
            'name': 'Human swordsman',
            'pos': [18, 7],
            'skin': new Sprite({
                'url': '/images/units.png',
                'pos': [0, 256],
                'size': [128, 128],
                'speed': this.playerSpeed,
                'frames': [0]
            })
        }));

        this.prepareCanvas();
        this.registerEventHandler();

        this.main();
    }

    prepareCanvas() {
        const canvas = document.querySelectorAll('canvas');

        for (let i = 0; i < canvas.length; i++) {
            canvas[i].width = this.colTileCount * this.fieldWidth;
            canvas[i].height = this.rowTileCount * this.fieldWidth;
        }

        utils.drawImage({
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'tileset': this.tileset,
            'ctx': this.ctxGround1,
            'array': this.ground1
        });
        utils.drawImage({
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'tileset': this.tileset,
            'ctx': this.ctxGround2,
            'array': this.ground2
        });
        utils.drawImage({
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'tileset': this.tileset,
            'ctx': this.ctxTop1,
            'array': this.top1
        });
    }

    registerEventHandler() {
        this.canvasTop1.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
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
            playerSpeed = this.playerSpeed,
            wrapper = this.wrapper;
        let valueX = this.offsetX,
            valueY = this.offsetY;

        if (input.isDown('S')) {
            valueY = this.offsetY - ((playerSpeed * this.fieldWidth) * delta);
            // player.pos[1] += playerSpeed * delta;
        }

        if (input.isDown('W')) {
            valueY = this.offsetY + ((playerSpeed * this.fieldWidth) * delta);
            // player.pos[1] -= playerSpeed * delta;
        }

        if (input.isDown('D')) {
            valueX = this.offsetX - ((playerSpeed * this.fieldWidth) * delta);
            // player.pos[0] += playerSpeed * delta;
        }

        if (input.isDown('A')) {
            valueX = this.offsetX + ((playerSpeed * this.fieldWidth) * delta);
            // player.pos[0] -= playerSpeed * delta;
        }

        if (input.isDown('S') || input.isDown('W') || input.isDown('A') || input.isDown('D')) {
            const maxOffsetX = (this.colTileCount * this.fieldWidth) - this.innerWidth,
                maxOffsetY = (this.rowTileCount * this.fieldWidth) - this.innerHeight;

            if (valueX < 0 && valueX > maxOffsetX * -1) {
                this.offsetX = valueX;
            } else if (valueX < 0 && valueX <= maxOffsetX * -1) {
                this.offsetX = maxOffsetX * -1;
            } else {
                this.offsetX = 0;
            }

            if (valueY < 0 && valueY > maxOffsetY * -1) {
                this.offsetY = valueY;
            } else if (valueY < 0 && valueY <= maxOffsetY * -1) {
                this.offsetY = maxOffsetY * -1;
            } else {
                this.offsetY = 0;
            }

            wrapper.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;
            player.walk();

        } else if (player.moving) {
            player.stop();
        }
    }

    onMouseMove(e) {
        const player = this.units[0];

        if (e.pageX < this.innerWidth / 2 && player.direction === 'RIGHT') {
            player.turn('LEFT');
        } else if (e.pageX >= this.innerWidth / 2 && player.direction === 'LEFT') {
            player.turn('RIGHT');
        }
        
        // if (e.pageX < player.pos[0] * this.fieldWidth && player.direction === 'RIGHT') {
        //     player.turn('LEFT');
        // } else if (e.pageX >= player.pos[0] * this.fieldWidth && player.direction === 'LEFT') {
        //     player.turn('RIGHT');
        // }
    }

    onRightClick(e) {
        e.preventDefault();
    }
}
