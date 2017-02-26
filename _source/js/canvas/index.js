import Units from '../units';
import Interactions from './interactions';
import Map from './map';
import utils from './utils';

export default class Canvas {
    constructor(config) {
        this.debug = true;
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
        this.tileset = this.resources.get('/images/tileset.png');
        this.lastTime = Date.now();
        this.gameTime = 0;
        this.playerSpeed = config.races[config.units.player.race].speed;
        this.units = new Units(config, this.debug);
        this.unitsList = this.units.list;
        this.map = new Map(this.blockedArr, this.unitsList);
        this.player = this.unitsList[0];
        this.interactions = new Interactions({
            'unitsList': this.unitsList,
            'canvasTop1': this.canvasTop1,
            'blockedArr': this.blockedArr,
            'map': this.map,
            'playerSpeed': this.playerSpeed,
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'fieldWidth': this.fieldWidth,
            'debug': this.debug
        });

        this.prepareCanvas();
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
                    if (this.blockedArr[r][c] === 2) {
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

        this.interactions.update(delta);
        this.updateEntities(delta);
    }

    updateEntities(delta) {
        let unit;

        for (let i = 0; i < this.unitsList.length; i++) {
            unit = this.unitsList[i];
            unit.skin.update(delta);

            // Stop after animation
            if (unit.skin.frames.length === Math.floor(unit.skin.index) && unit.skin.once) {
                if (unit.attacking) {
                    this.checkForHit();
                }

                unit.stop();
            }
        }
    }

    checkForHit() {
        const unitsList = this.unitsList,
            player = this.player;
        let i = this.unitsList.length;

        while (i--) {
            const unit = unitsList[i];

            if (unit.id !== player.id) {
                const playerPosX = Math.round(this.fieldWidth * player.pos[0]),
                    enemyPosX = Math.round(this.fieldWidth * unit.pos[0]),
                    playerPosY = Math.round(this.fieldWidth * player.pos[1]),
                    enemyPosY = Math.round(this.fieldWidth * unit.pos[1]),
                    playerWidth = 40,
                    playerHeight = 50;

                if (playerPosY > enemyPosY - (playerHeight / 2) && playerPosY < enemyPosY + (playerHeight / 2)) {
                    if (player.direction === 'LEFT') {
                        const playerReach = playerPosX - playerWidth - player.range;

                        if (playerReach <= enemyPosX && playerPosX > enemyPosX) {
                            console.log('💘');
                        }
                    }

                    if (player.direction === 'RIGHT') {
                        const playerReach = playerPosX + playerWidth + player.range;
                        
                        if (playerReach >= enemyPosX && playerPosX < enemyPosX) {
                            console.log('💘');
                        }
                    }
                }
            }
        }
    }

    render() {
        // Clear canvas hack
        this.canvasAnim.width = this.canvasAnim.width;
        this.renderEntities(this.unitsList);
    }

    renderEntities(list) {
        for (let i = 0; i < list.length; i++) {
            this.renderEntity(list[i], list[i].skin);
        }
    }

    renderEntity(unit, ...args) {
        this.ctxAnim.save();

        if (this.debug) {
            this.map.showDebugFields({
                'ctx': this.ctxAnim,
                'unit': unit,
                'units': this.unitsList
            });
        }

        this.ctxAnim.translate(
            (unit.pos[0] * this.fieldWidth) - 64,
            (unit.pos[1] * this.fieldWidth) - 125
        );

        for (let i = 0; i < args.length; i++) {
            // Skin
            args[i].render(this.ctxAnim, this.resources);
        }

        this.ctxAnim.restore();
    }
}
