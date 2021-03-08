import config from '../config.js';
import Input from '../utils/Input.js';
import { Units } from '../units/units.js';
import { getPath } from './path.js';

class Interactions {
  constructor(data) {
    this.wrapper = document.getElementById('canvas-wrapper');
    this.input = new Input();
    this.offsetX = 0;
    this.offsetY = 0;
    this.map = data.map;
    this.rowTileCount = data.rowTileCount;
    this.colTileCount = data.colTileCount;
    this.fieldWidth = data.fieldWidth;
    this.items = data.items;

    this.registerEventHandler();
  }

  update(delta) {
    this.handleInput(delta);
  }

  registerEventHandler() {
    config.canvasTop1.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
  }

  onMouseMove(e) {
    const player = Units.player;

    if (player.attacking) {
      // return;
    }

    // Left screen half
    if (
      e.pageX + this.offsetX * -1 < player.pos[0] * this.fieldWidth &&
      player.direction === 'RIGHT'
    ) {
      player.turn('LEFT');

      // Continue animation
      if (player.moving) {
        player.walk();
      }
      // Right screen halfdd
    } else if (
      e.pageX + this.offsetX * -1 >= player.pos[0] * this.fieldWidth &&
      player.direction === 'LEFT'
    ) {
      player.turn('RIGHT');

      // Continue animation
      if (player.moving) {
        player.walk();
      }
    }
  }

  onRightClick(e) {
    e.preventDefault();
  }

  onMouseDown(e) {
    const player = Units.player;

    // Left click
    if (e.button === 0) {
      const x = Math.floor((e.pageX + this.offsetX * -1) / this.fieldWidth);
      const y = Math.floor((e.pageY + this.offsetY * -1) / this.fieldWidth);
      const item = this.checkForItem({ x, y });

      if (player.attacking) {
        // Continue animation
        player.skin.once = false;
      } else if (item) {
        player.equip(item);
      } else {
        // Start animation
        player.attack();
      }
    }
  }

  onMouseUp(e) {
    const player = Units.player;

    // Left click
    if (e.button === 0) {
      // Finish after current animation
      if (player.attacking) {
        player.skin.once = true;
      }
    }
  }

  // eslint-disable-next-line
  handleInput(delta) {
    const input = this.input,
      down = input.isDown('S'),
      up = input.isDown('W'),
      right = input.isDown('D'),
      left = input.isDown('A'),
      player = Units.player,
      playerSpeed = player.speed,
      wrapper = this.wrapper;
    let valueX = this.offsetX,
      valueY = this.offsetY,
      blockedX = true,
      blockedY = true;

    if (player.attacking) {
      return;
    }

    if (down) {
      valueY = this.offsetY - playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[1] + playerSpeed * delta,
        newY = Math.floor(newPos + 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = newY > y,
        mapPosition = this.map.map[newY] ? this.map.map[newY][x] : 2;

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedY = false;
        player.pos[1] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: x,
            newY: Math.floor(newPos),
            unitId: player.id
          });
          this.setPath();
        }
      }
    }

    if (up) {
      valueY = this.offsetY + playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[1] - playerSpeed * delta,
        newY = Math.floor(newPos - 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = newY < Math.floor(player.pos[1]),
        mapPosition = this.map.map[newY] ? this.map.map[newY][x] : 2;

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedY = false;
        player.pos[1] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: x,
            newY: Math.floor(newPos),
            unitId: player.id
          });
          this.setPath();
        }
      }
    }

    if (right) {
      valueX = this.offsetX - playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[0] + playerSpeed * delta,
        newX = Math.floor(newPos + 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = newX > Math.floor(player.pos[0]),
        mapPosition = this.map.map[y][newX];

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedX = false;
        player.pos[0] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: Math.floor(newPos),
            newY: y,
            unitId: player.id
          });
          this.setPath();
        }
      }
    }

    if (left) {
      valueX = this.offsetX + playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[0] - playerSpeed * delta,
        newX = Math.floor(newPos - 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = newX < Math.floor(player.pos[0]),
        mapPosition = this.map.map[y][newX];

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedX = false;
        player.pos[0] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: Math.floor(newPos),
            newY: y,
            unitId: player.id
          });
          this.setPath();
        }
      }
    }

    if (down || up || right || left) {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;
      const maxOffsetX = this.colTileCount * this.fieldWidth - innerWidth,
        maxOffsetY = this.rowTileCount * this.fieldWidth - innerHeight;

      // Horizontal map scrolling
      if (
        !blockedX && // player not blocked
        !(right && left) &&
        valueX < 0 &&
        valueX > maxOffsetX * -1 &&
        player.pos[0] * this.fieldWidth > innerWidth / 2 - playerSpeed && // + next line: player in center
        player.pos[0] * this.fieldWidth <
          this.colTileCount * this.fieldWidth - innerWidth / 2 + playerSpeed
      ) {
        this.offsetX = valueX;

        // Limit scrolling - end of the map
      } else if (
        valueX < 0 &&
        valueX <= maxOffsetX * -1 &&
        innerWidth < this.colTileCount * this.fieldWidth
      ) {
        this.offsetX = maxOffsetX * -1;

        // Limit scrolling - start of the map
      } else if (valueX > 0) {
        this.offsetX = 0;
      }

      // Vertical map scrolling
      if (
        !blockedY && // player not blocked
        !(up && down) &&
        valueY < 0 &&
        valueY > maxOffsetY * -1 &&
        player.pos[1] * this.fieldWidth > innerHeight / 2 - playerSpeed && // + next line: player in center
        player.pos[1] * this.fieldWidth <
          this.rowTileCount * this.fieldWidth - innerHeight / 2 + playerSpeed
      ) {
        this.offsetY = valueY;

        // Limit scrolling - end of the map
      } else if (
        valueY < 0 &&
        valueY <= maxOffsetY * -1 &&
        innerHeight < this.rowTileCount * this.fieldWidth
      ) {
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
  }

  getSmoothPixelValue(value) {
    const counts = [];

    for (let i = 0; i < this.fieldWidth; i++) {
      counts.push((1 / this.fieldWidth) * i);
    }

    const decimalSeparatedValues = value.toFixed(3).toString().split('.');
    const decimalPlaceValue = parseInt(decimalSeparatedValues[1], 10) / 1000;
    // eslint-disable-next-line no-confusing-arrow
    const closest = counts.reduce((prev, curr) =>
      Math.abs(curr - decimalPlaceValue) < Math.abs(prev - decimalPlaceValue)
        ? curr
        : prev
    );
    const newValue = Math.floor(value) + closest;

    return newValue;
  }

  checkForItem({ x, y }) {
    return this.items.find(
      (item) =>
        item.pos[0] === x && item.pos[1] === y && this.itemInRange({ x, y })
    );
  }

  itemInRange({ x, y }) {
    const playerX = Math.floor(Units.player.pos[0]);
    const playerY = Math.floor(Units.player.pos[1]);

    if (
      (x === playerX + 1 && y === playerY) ||
      (x === playerX + 1 && y === playerY + 1) ||
      (x === playerX + 1 && y === playerY - 1) ||
      (x === playerX - 1 && y === playerY) ||
      (x === playerX - 1 && y === playerY + 1) ||
      (x === playerX - 1 && y === playerY - 1) ||
      (x === playerX && y === playerY - 1) ||
      (x === playerX && y === playerY + 1) ||
      (x === playerX && y === playerY)
    ) {
      return true;
    }
    return false;
  }

  setPath() {
    let i = Units.list.length;

    while (i--) {
      const enemy = Units.list[i];
      const player = Units.player;
      const playerInRange = enemy.isPlayerInRange(player.pos);

      if (!enemy.id.includes('player') && playerInRange) {
        const playerPos1 = [
            Math.floor(player.pos[0] + 1),
            Math.floor(player.pos[1])
          ],
          playerPos2 = [
            Math.floor(player.pos[0] - 1),
            Math.floor(player.pos[1])
          ];
        let path1, path2;

        if (config.debug) {
          console.log('👹 🚶‍♂️');
        }

        path1 = getPath({
          world: this.map.map,
          pathStart: enemy.tile,
          pathEnd: playerPos1,
          unitId: enemy.id
        });
        path2 = getPath({
          world: this.map.map,
          pathStart: enemy.tile,
          pathEnd: playerPos2,
          unitId: enemy.id
        });

        // Chooose best path
        if (
          (path1.length <= path2.length && path1.length !== 0) ||
          path2.length === 0
        ) {
          enemy.path = path1;
        } else {
          enemy.path = path2;
        }

        // Check if next tile has not changed
        if (
          enemy.nextTile &&
          enemy.path.length > 1 &&
          (enemy.nextTile[0] !== enemy.path[1][0] ||
            enemy.nextTile[1] !== enemy.path[1][1])
        ) {
          path1 = [
            enemy.tile,
            ...getPath({
              world: this.map.map,
              pathStart: enemy.nextTile,
              pathEnd: playerPos1,
              unitId: enemy.id
            })
          ];
          path2 = [
            enemy.tile,
            ...getPath({
              world: this.map.map,
              pathStart: enemy.nextTile,
              pathEnd: playerPos2,
              unitId: enemy.id
            })
          ];

          if (
            (path1.length <= path2.length && path1.length !== 1) ||
            path2.length === 1
          ) {
            enemy.path = path1;
          } else {
            enemy.path = path2;
          }

          // Check for duplicate first tile
          if (
            enemy.path.length > 1 &&
            enemy.path[0][0] === enemy.path[1][0] &&
            enemy.path[0][1] === enemy.path[1][1]
          ) {
            enemy.path.splice(0, 1);
          }
        }
      }
    }
  }
}

export { Interactions };
