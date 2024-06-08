import config from '../config.js';
import { Input } from '../utils/Input.js';
import { Units } from '../units/units.js';
import { Animations } from '../animations/animations.js';
import { Events } from '../events/events.js';
import { GameData } from '../gameData.js';
import { getPath } from '../map/path.js';
import { socket } from '../utils/socket.js';
import { sounds } from '../utils/sounds.js';

const body = document.getElementsByTagName('body')[0];
const wrapper = document.getElementById('canvas-wrapper');
const minimapCanvas = document.getElementById('minimap-canvas');

class Interactions {
  constructor(data) {
    this.input = new Input();
    this.map = data.map;
    this.rowTileCount = data.rowTileCount;
    this.colTileCount = data.colTileCount;
    this.fieldWidth = data.fieldWidth;
    this.mapEvents = data.mapEvents;
    this.serverRequestInProgress = false;
    this.windowInnerWidth = window.innerWidth;
    this.windowInnerHeight = window.innerHeight;

    this.resetOffset();
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
    wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
    wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
    wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
  }

  onMouseMove(e) {
    const player = Units.player;

    if (player.dead) {
      return;
    }

    const x = Math.floor((e.pageX + this.offsetX * -1) / this.fieldWidth);
    const y = Math.floor((e.pageY + this.offsetY * -1) / this.fieldWidth);
    const event = Events.getEventByPos({ x, y });

    if (event && this.eventInRange({ x, y })) {
      body.classList.add('cursor--use');
      body.classList.remove('cursor--info');
    } else if (event && !this.eventInRange({ x, y })) {
      body.classList.add('cursor--info');
      body.classList.remove('cursor--use');
    } else {
      body.classList.remove('cursor--use');
      body.classList.remove('cursor--info');
    }

    // Left screen half
    if (
      e.pageX + this.offsetX * -1 < player.pos[0] * this.fieldWidth &&
      player.direction === 'RIGHT'
    ) {
      player.turn('LEFT');

      socket.emit('turn', {
        direction: 'LEFT'
      });

      // Continue animation
      if (player.moving) {
        player.walk();
      }
      // Right screen half
    } else if (
      e.pageX + this.offsetX * -1 >= player.pos[0] * this.fieldWidth &&
      player.direction === 'LEFT'
    ) {
      player.turn('RIGHT');

      socket.emit('turn', {
        direction: 'RIGHT'
      });

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

    if (player.dead) {
      return;
    }

    // Left click
    if (e.button === 0) {
      const x = Math.floor((e.pageX + this.offsetX * -1) / this.fieldWidth);
      const y = Math.floor((e.pageY + this.offsetY * -1) / this.fieldWidth);
      const event = Events.getEventByPos({ x, y });

      if (player.attacking) {
        // Continue animation
        player.skin.once = false;

        socket.emit('attack');
      } else if (event && this.eventInRange({ x, y })) {
        const animation = Animations.getAnimation({ x, y });

        if (event.type === 'item') {
          player.takeItem(event);
          Events.removeEvent(event);
          socket.emit('remove-event', { eventId: event.id });
          socket.emit('take-item', { item: event });
          sounds.effects.play('take');
          body.classList.add('cursor--use');
          body.classList.remove('cursor--info');
        }
        if (event.type === 'loot') {
          const eventId = event.id.split('.')[0];

          if (eventId.includes('random')) {
            const randomItemId = GameData.getRandomItem(eventId).id;

            player.takeItem({
              id: randomItemId
            });
            socket.emit('take-item', { item: { ...event, id: randomItemId } });
          } else {
            player.takeItem(event);
            socket.emit('take-item', { item: event });
          }

          Events.removeEvent(event);
          socket.emit('remove-event', {
            eventId: event.id,
            animationId: animation.id
          });
          animation.play();
          if (animation.sound) {
            sounds.effects.play(animation.sound);
          } else {
            sounds.effects.play('take');
          }
          body.classList.add('cursor--use');
          body.classList.remove('cursor--info');
        }
        if (event.type === 'fire') {
          if (animation.sprite.once) {
            animation.continue();
          } else {
            animation.stop();
          }
        }
      } else {
        // Start animation
        player.attack();
        sounds.swing();
        socket.emit('attack');
      }
    }
  }

  onMouseUp(e) {
    const player = Units.player;

    if (player.dead) {
      return;
    }

    // Left click
    if (e.button === 0) {
      // Finish after current animation
      if (player.attacking) {
        player.skin.once = true;

        socket.emit('player-stop-attack');
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
      playerSpeed = player.speed;
    let valueX =
        player.pos[0] * this.fieldWidth * -1 + this.windowInnerWidth / 2,
      valueY =
        player.pos[1] * this.fieldWidth * -1 + this.windowInnerHeight / 2,
      blockedX = true,
      blockedY = true;

    // if (player.attacking || player.dead) {
    if (player.dead) {
      return;
    }

    if (down) {
      valueY = valueY - playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[1] + playerSpeed * delta,
        newY = Math.floor(newPos + 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) > y,
        mapPosition = this.map.map[newY] ? this.map.map[newY][x] : 2;

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedY = false;
        // player.pos[1] = this.getSmoothPixelValue(newPos);
        player.pos[1] = newPos;

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: x,
            newY: Math.floor(newPos),
            unitId: player.id
          });
          this.setPath();
          this.checkForNewChunk([x, newPos]);
          player.stats.tilesWalked++;

          socket.emit('move', {
            pos: [x, Math.floor(newPos)]
          });

          const mapItem = this.checkMap({ x, y: Math.floor(newPos) });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (up) {
      valueY = valueY + playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[1] - playerSpeed * delta,
        newY = Math.floor(newPos - 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) < y,
        mapPosition = this.map.map[newY] ? this.map.map[newY][x] : 2;

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedY = false;
        // player.pos[1] = this.getSmoothPixelValue(newPos);
        player.pos[1] = newPos;

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: x,
            newY: Math.floor(newPos),
            unitId: player.id
          });
          this.setPath();
          this.checkForNewChunk([x, newPos]);
          player.stats.tilesWalked++;

          socket.emit('move', {
            pos: [x, Math.floor(newPos)]
          });

          const mapItem = this.checkMap({ x, y: Math.floor(newPos) });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (right) {
      valueX = valueX - playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[0] + playerSpeed * delta,
        newX = Math.floor(newPos + 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) > x,
        mapPosition = this.map.map[y][newX];
      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedX = false;
        // player.pos[0] = this.getSmoothPixelValue(newPos);
        player.pos[0] = newPos;

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: Math.floor(newPos),
            newY: y,
            unitId: player.id
          });
          this.setPath();
          this.checkForNewChunk([newPos, y]);
          player.stats.tilesWalked++;

          socket.emit('move', {
            pos: [Math.floor(newPos), y]
          });

          const mapItem = this.checkMap({ x: Math.floor(newPos), y });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (left) {
      valueX = valueX + playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[0] - playerSpeed * delta,
        newX = Math.floor(newPos - 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) < x,
        mapPosition = this.map.map[y][newX];

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedX = false;
        // player.pos[0] = this.getSmoothPixelValue(newPos);
        player.pos[0] = newPos;

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: Math.floor(newPos),
            newY: y,
            unitId: player.id
          });
          this.setPath();
          this.checkForNewChunk([newPos, y]);
          player.stats.tilesWalked++;

          socket.emit('move', {
            pos: [Math.floor(newPos), y]
          });

          const mapItem = this.checkMap({ x: Math.floor(newPos), y });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (down || up || right || left) {
      const maxOffsetX =
          this.colTileCount * this.fieldWidth - this.windowInnerWidth,
        maxOffsetY =
          this.rowTileCount * this.fieldWidth - this.windowInnerHeight;

      // Horizontal map scrolling
      if (
        !blockedX && // player not blocked
        !(right && left) &&
        valueX < 0 &&
        valueX > maxOffsetX * -1 &&
        player.pos[0] * this.fieldWidth >
          this.windowInnerWidth / 2 - playerSpeed && // + next line: player in center
        player.pos[0] * this.fieldWidth <
          this.colTileCount * this.fieldWidth -
            this.windowInnerWidth / 2 +
            playerSpeed
      ) {
        this.offsetX = valueX;

        // Limit scrolling - end of the map
      } else if (
        valueX < 0 &&
        valueX <= maxOffsetX * -1 &&
        this.windowInnerWidth < this.colTileCount * this.fieldWidth
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
        player.pos[1] * this.fieldWidth >
          this.windowInnerHeight / 2 - playerSpeed && // + next line: player in center
        player.pos[1] * this.fieldWidth <
          this.rowTileCount * this.fieldWidth -
            this.windowInnerHeight / 2 +
            playerSpeed
      ) {
        this.offsetY = valueY;

        // Limit scrolling - end of the map
      } else if (
        valueY < 0 &&
        valueY <= maxOffsetY * -1 &&
        this.windowInnerHeight < this.rowTileCount * this.fieldWidth
      ) {
        this.offsetY = maxOffsetY * -1;

        // Limit scrolling - start of the map
      } else if (valueY > 0) {
        this.offsetY = 0;
      }

      wrapper.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;
      minimapCanvas.style.transform = `translateX(${
        this.offsetX / 10 + 10
      }px) translateY(${this.offsetY / 10 + 35}px)`;

      if (!player.moving) {
        player.walk();
      }
      // Stop moving but not attacking
    } else if (player.moving && player.attacking) {
      player.moving = false;
      sounds.walk.stop();
      // Stop all
    } else if (player.moving) {
      player.stop();
    }
  }

  checkForNewChunk(pos) {
    let direction = null;
    const chunkSize = config.chunkSize;
    const roundedPos = [Math.floor(pos[0]), Math.floor(pos[1])];

    if (roundedPos[0] > config.chunkSize * 2 - 1) {
      direction = 'right';
    } else if (roundedPos[0] < chunkSize) {
      direction = 'left';
    } else if (roundedPos[1] > chunkSize * 2 - 1) {
      direction = 'bottom';
    } else if (roundedPos[1] < chunkSize) {
      direction = 'top';
    }

    if (!this.serverRequestInProgress && direction) {
      this.serverRequestInProgress = true;
      socket.emit('new-chunk', { direction });
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

  checkMap({ x, y }) {
    return this.mapEvents.find(
      (map) =>
        map.pos[0] === x && map.pos[1] === y && this.eventInRange({ x, y })
    );
  }

  eventInRange({ x, y }) {
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

  resetOffset() {
    this.offsetX =
      Units.player.pos[0] * this.fieldWidth * -1 + this.windowInnerWidth / 2;
    this.offsetY =
      Units.player.pos[1] * this.fieldWidth * -1 + this.windowInnerHeight / 2;

    if (this.offsetX >= 0) {
      this.offsetX = 0;
    }

    if (this.offsetY >= 0) {
      this.offsetY = 0;
    }

    wrapper.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;
    minimapCanvas.style.transform = `translateX(${
      this.offsetX / 10 + 10
    }px) translateY(${this.offsetY / 10 + 35}px)`;
  }

  updateMap(map) {
    this.map = map;
  }

  setServerRequestInProgress(value) {
    this.serverRequestInProgress = value;
  }

  loadMap(mapItem) {
    console.log(mapItem);
  }

  // eslint-disable-next-line complexity
  setPath(unitId) {
    let i = Units.list.length;

    while (i--) {
      const enemy = Units.list[i];
      const player = Units.player;
      const playerInRange = enemy.isPlayerInSight(player.pos);

      if (
        !enemy.dead &&
        !enemy.id.includes('player') &&
        playerInRange &&
        (!unitId || enemy.id === unitId)
      ) {
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

        enemy.target = player.id;

        sounds.battle.play();
        sounds.grunt();

        socket.emit('ai-move', {
          path: enemy.path,
          id: enemy.id
        });
      }
    }
  }
}

export { Interactions };
