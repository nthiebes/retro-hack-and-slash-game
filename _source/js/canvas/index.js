import Sprite from '../utils/sprite';
import Input from '../utils/input';
import Unit from '../unit';
import Map from './map';
import utils from './utils';

export default class Canvas {
    constructor(config) {
        this.debug = true;
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
        this.blockedArr = config.map[3];
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
        this.map = new Map(this.blockedArr);

        this.units.push(new Unit({
            'id': 2,
            'name': 'Nico',
            'pos': [7, 6],
            'skin': new Sprite({
                'url': '/images/human0.png',
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
        if (this.debug) {
            for (let r = 0; r < this.blockedArr.length; r++) {
                for (let c = 0; c < this.blockedArr[0].length; c++) {
                    if (this.blockedArr[r][c] === 1) {
                        utils.drawSquare({
                            'ctx': this.ctxTop1,
                            'color': 'rgba(0,0,0,0.5)',
                            'width': this.fieldWidth,
                            'height': this.fieldWidth,
                            'x': c * this.fieldWidth,
                            'y': r * this.fieldWidth
                        });
                    }
                }
            }
        }
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

        if (this.debug) {
            this.map.showDebugFields({
                'ctx': this.ctxAnim,
                'unit': unit
            });
        }

        this.ctxAnim.translate(
            (unit.pos[0] * this.fieldWidth) - 64,
            (unit.pos[1] * this.fieldWidth) - 110
        );

        for (let i = 0; i < args.length; i++) {
            args[i].render(this.ctxAnim, this.resources);
        }

        this.ctxAnim.restore();
    }

    handleInput(delta) {
        const input = this.input,
            down = input.isDown('S'),
            up = input.isDown('W'),
            right = input.isDown('D'),
            left = input.isDown('A'),
            player = this.units[0],
            playerSpeed = this.playerSpeed,
            wrapper = this.wrapper;
        let valueX = this.offsetX,
            valueY = this.offsetY;

        if (down) {
            valueY = this.offsetY - ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[1] + (playerSpeed * delta),
                newY = Math.floor(newPos),
                x = Math.floor(player.pos[0]);

            if (this.blockedArr[newY][x] === 0) {
                player.pos[1] = newPos;
            }
        }

        if (up) {
            valueY = this.offsetY + ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[1] - (playerSpeed * delta),
                newY = Math.floor(newPos),
                x = Math.floor(player.pos[0]);

            if (this.blockedArr[newY][x] === 0) {
                player.pos[1] = newPos;
            }
        }

        if (right) {
            valueX = this.offsetX - ((playerSpeed * this.fieldWidth) * delta);
            
            const newPos = player.pos[0] + (playerSpeed * delta),
                newX = Math.floor(newPos),
                y = Math.floor(player.pos[1]);

            if (this.blockedArr[y][newX] === 0) {
                player.pos[0] = newPos;
            }
        }

        if (left) {
            valueX = this.offsetX + ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[0] - (playerSpeed * delta),
                newX = Math.floor(newPos),
                y = Math.floor(player.pos[1]);

            if (this.blockedArr[y][newX] === 0) {
                player.pos[0] = newPos;
            }
        }

        if (down || up || right || left) {
            const maxOffsetX = (this.colTileCount * this.fieldWidth) - this.innerWidth,
                maxOffsetY = (this.rowTileCount * this.fieldWidth) - this.innerHeight;

            // Horizontal map scrolling
            if (valueX < 0 && 
                valueX > maxOffsetX * -1 && 
                player.pos[0] * this.fieldWidth > (this.innerWidth / 2) - playerSpeed && 
                player.pos[0] * this.fieldWidth < (this.colTileCount * this.fieldWidth) - (this.innerWidth / 2) + playerSpeed) {
                this.offsetX = valueX;

            // Limit scrolling - end of the map
            } else if (valueX < 0 && valueX <= maxOffsetX * -1) {
                this.offsetX = maxOffsetX * -1;

            // Limit scrolling - start of the map
            } else if (valueX > 0) {
                this.offsetX = 0;
            }

            // Vertical map scrolling
            if (valueY < 0 && 
                valueY > maxOffsetY * -1 && 
                player.pos[1] * this.fieldWidth > (this.innerHeight / 2) - playerSpeed && 
                player.pos[1] * this.fieldWidth < (this.rowTileCount * this.fieldWidth) - (this.innerHeight / 2) + playerSpeed) {
                this.offsetY = valueY;

            // Limit scrolling - end of the map
            } else if (valueY < 0 && valueY <= maxOffsetY * -1) {
                this.offsetY = maxOffsetY * -1;

            // Limit scrolling - start of the map
            } else if (valueY > 0) {
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

        if (e.pageX + (this.offsetX * -1) < player.pos[0] * this.fieldWidth && player.direction === 'RIGHT') {
            player.turn('LEFT');
        } else if (e.pageX + (this.offsetX * -1) >= player.pos[0] * this.fieldWidth && player.direction === 'LEFT') {
            player.turn('RIGHT');
        } 
    }

    onRightClick(e) {
        e.preventDefault();
    }
}
