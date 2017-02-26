import Input from '../utils/input';
import Path from './path';

export default class Interactions {
    constructor(config) {
        this.debug = config.debug;
        this.wrapper = document.getElementById('canvas-wrapper');
        this.input = new Input();
        this.path = new Path();
        this.unitsList = config.unitsList;
        this.canvasTop1 = config.canvasTop1;
        this.player = this.unitsList[0];
        this.offsetX = 0;
        this.offsetY = 0;
        this.map = config.map;
        this.playerSpeed = config.playerSpeed;
        this.rowTileCount = config.rowTileCount;
        this.colTileCount = config.colTileCount;
        this.fieldWidth = config.fieldWidth;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        this.registerEventHandler();
    }

    update(delta) {
        this.handleInput(delta);
    }

    registerEventHandler() {
        this.canvasTop1.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
    }

    onMouseMove(e) {
        const player = this.player;

        if (player.attacking) {
            return;
        }

        if (e.pageX + (this.offsetX * -1) < player.pos[0] * this.fieldWidth && player.direction === 'RIGHT') {
            player.turn('LEFT');

            if (player.moving) {
                player.walk();
            }
        } else if (e.pageX + (this.offsetX * -1) >= player.pos[0] * this.fieldWidth && player.direction === 'LEFT') {
            player.turn('RIGHT');

            if (player.moving) {
                player.walk();
            }
        }
    }

    onRightClick(e) {
        e.preventDefault();
    }

    onMouseDown() {
        if (this.player.attacking) {
            // Continue animation
            this.player.skin.once = false;
        } else {
            // Start animation
            this.player.attack();
        }
    }

    onMouseUp() {
        // Finish after current animation
        this.player.skin.once = true;
    }

    getPath(cfg) {
        var path = [],
            speed = cfg.speed,
            x1 = cfg.x1,
            y1 = cfg.y1,
            x2 = cfg.x2,
            y2 = cfg.y2,
            lastX = x1,
            lastY = y1,
            x = (x2 - x1) / speed,
            y = (y2 - y1) / speed;

        for (var i = 0; i <= speed; i++) {
            path.push([lastX, lastY]);
            lastX = lastX + x;
            lastY = lastY + y;
        }

        return path;
    }

    handleInput(delta) {
        const input = this.input,
            down = input.isDown('S'),
            up = input.isDown('W'),
            right = input.isDown('D'),
            left = input.isDown('A'),
            player = this.player,
            playerSpeed = this.playerSpeed,
            wrapper = this.wrapper,
            pathAvailable = player.animationPath.length > 0,
            pathAnimationDone = player.animationIndex === player.animationPath.length && player.animationPath.length !== 0,
            attacking = this.player.attacking;
        let valueX = this.offsetX,
            valueY = this.offsetY,
            blockedX = true,
            blockedY = true,
            newX,
            newY;

        if (this.player.attacking) {
            return;
        }

        // if (pathAnimationDone) {
        //     player.animationPath = [];
        //     player.animationIndex = 0;
        //     player.movingUp = false;
        //     player.movingDown = false;
        //     player.movingLeft = false;
        //     player.movingRight = false;

        //     if (!up && !down && !left && !right) {
        //         player.stop();
        //     }
        // }


        // if (!player.movingUp && up && !down && !attacking) {
        //     newY = Math.round(player.pos[1] - 1);
        // }

        // if (!player.movingDown && down && !up && !attacking) {
        //     newY = Math.round(player.pos[1] + 1);
        // }

        // if (!player.movingLeft && left && !right && !attacking) {
        //     newX = Math.round(player.pos[0] - 1);
        // }

        // if (!player.movingRight && right && !left && !attacking) {
        //     newX = Math.round(player.pos[0] + 1);
        // }

        // if (((!player.movingUp && up) || (!player.movingDown && down) || (!player.movingLeft && left) || (!player.movingRight && right)) && !attacking) {
        //     if (up) {
        //         player.movingUp = true;
        //     }

        //     if (down) {
        //         player.movingDown = true;
        //     }

        //     if (left) {
        //         player.movingLeft = true;
        //     }

        //     if (right) {
        //         player.movingRight = true;
        //     }

        //     let speed = playerSpeed * 3;

        //     if ((left && up) || (left && down) || (right && up) || (right && down)) {
        //         speed = playerSpeed * 4;
        //     }

        //     const targetTile = [newX || player.targetTile[0], newY || player.targetTile[1]],
        //         a = targetTile[1] - player.pos[1],
        //         b = targetTile[0] - player.pos[0],
        //         path = this.getPath({
        //             'speed': speed,
        //             'angle': Math.atan2(a, b),
        //             'x1': player.pos[0],
        //             'y1': player.pos[1],
        //             'x2': targetTile[0],
        //             'y2': targetTile[1]
        //         });

        //     path[path.length - 1] = [Math.round(path[path.length - 1][0]), Math.round(path[path.length - 1][1])]; // Round last entry
        //     player.targetTile = targetTile;
        //     player.animationPath = path;
        //     player.animationIndex = 0;

        //     if (!player.moving) {
        //         player.walk();
        //     }
        // }

        // if (player.animationIndex < player.animationPath.length) {
        //     player.pos[0] = player.animationPath[player.animationIndex][0];
        //     player.pos[1] = player.animationPath[player.animationIndex][1];
        //     player.animationIndex++;
        // }




        




        // return;

        if (down) {
            valueY = this.offsetY - ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[1] + (playerSpeed * delta),
                newY = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newY > y;

            if (this.map.map[newY][x] <= 1) {
                blockedY = false;
                player.pos[1] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': x,
                        'newY': newY
                    });
                }
            }
        }

        if (up) {
            valueY = this.offsetY + ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[1] - (playerSpeed * delta),
                newY = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newY < Math.floor(player.pos[1]);

            if (this.map.map[newY][x] <= 1) {
                blockedY = false;
                player.pos[1] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': x,
                        'newY': newY
                    });
                }
            }
        }

        if (right) {
            valueX = this.offsetX - ((playerSpeed * this.fieldWidth) * delta);
            
            const newPos = player.pos[0] + (playerSpeed * delta),
                newX = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newX > Math.floor(player.pos[0]);

            if (this.map.map[y][newX] <= 1) {
                blockedX = false;
                player.pos[0] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': newX,
                        'newY': y
                    });
                }
            }
        }

        if (left) {
            valueX = this.offsetX + ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[0] - (playerSpeed * delta),
                newX = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newX < Math.floor(player.pos[0]);

            if (this.map.map[y][newX] <= 1) {
                blockedX = false;
                player.pos[0] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': newX,
                        'newY': y
                    });
                }
            }
        }

        if (down || up || right || left) {
            const maxOffsetX = (this.colTileCount * this.fieldWidth) - this.innerWidth,
                maxOffsetY = (this.rowTileCount * this.fieldWidth) - this.innerHeight;

            // Horizontal map scrolling
            if (!blockedX && // player not blocked
                !(right && left) && 
                valueX < 0 && 
                valueX > maxOffsetX * -1 && 
                player.pos[0] * this.fieldWidth > (this.innerWidth / 2) - playerSpeed && // + next line: player in center
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
            if (!blockedY && // player not blocked
                !(up && down) && 
                valueY < 0 && 
                valueY > maxOffsetY * -1 && 
                player.pos[1] * this.fieldWidth > (this.innerHeight / 2) - playerSpeed && // + next line: player in center
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

            if (!player.moving) {
                player.walk();
            }
        } else if (player.moving) {
            player.stop();
        }

        // temporary
        const playerPos1 = [Math.floor(player.pos[0] + 2), Math.floor(player.pos[1])],
            playerPos2 = [Math.floor(player.pos[0] - 2), Math.floor(player.pos[1])],
            enemy = this.unitsList[1],
            path1 = this.path.get(this.map.map, enemy.pos, playerPos1),
            path2 = this.path.get(this.map.map, enemy.pos, playerPos2);

        if (path1.length <= path2.length && 
            path1.length !== 0 || 
            path2.length === 0) {

            enemy.path = path1;
        } else {
            enemy.path = path2;
        }
    }
}
