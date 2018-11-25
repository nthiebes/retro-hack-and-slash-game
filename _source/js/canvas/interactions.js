import config from '../config.js';
import Input from '../utils/input.js';
import Path from './path.js';

export default class Interactions {
  constructor(data) {
    this.wrapper = document.getElementById('canvas-wrapper');
    this.input = new Input();
    this.path = new Path();
    this.unitsList = data.unitsList;
    this.player = this.unitsList[0];
    this.offsetX = 0;
    this.offsetY = 0;
    this.map = data.map;
    this.playerSpeed = data.playerSpeed;
    this.rowTileCount = data.rowTileCount;
    this.colTileCount = data.colTileCount;
    this.fieldWidth = data.fieldWidth;
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.registerEventHandler();
  }

  update(delta) {
    this.handleInput(delta);
  }

  registerEventHandler() {
    config.canvasTop1.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
  }

  onMouseMove(e) {
    const player = this.player;

    if (player.attacking) {
      return;
    }

    // Left screen half
    if (e.pageX + (this.offsetX * -1) < player.pos[0] * this.fieldWidth && player.direction === 'RIGHT') {
      player.turn('LEFT');

      // Continue animation
      if (player.moving) {
        player.walk();
      }
    // Right screen halfdd
    } else if (e.pageX + (this.offsetX * -1) >= player.pos[0] * this.fieldWidth && player.direction === 'LEFT') {
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
    // Left click
    if (e.button === 0) {
      if (this.player.attacking) {
        // Continue animation
        this.player.skin.once = false;
      } else {
        // Start animation
        this.player.attack();
      }
    }
  }

  onMouseUp(e) {
    // Left click
    if (e.button === 0) {
      // Finish after current animation
      this.player.skin.once = true;
    }
  }

  // eslint-disable-next-line
  handleInput(delta) {
    const input = this.input,
      down = input.isDown('S'),
      up = input.isDown('W'),
      right = input.isDown('D'),
      left = input.isDown('A'),
      player = this.player,
      playerSpeed = this.playerSpeed,
      wrapper = this.wrapper;
    let valueX = this.offsetX,
      valueY = this.offsetY,
      blockedX = true,
      blockedY = true;

    if (this.player.attacking) {
      return;
    }

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
      this.setPath(player);
    } else if (player.moving) {
      player.stop();
    }

  }

  setPath(player) {
    const playerPos1 = [Math.floor(player.pos[0] + 1), Math.floor(player.pos[1])],
      playerPos2 = [Math.floor(player.pos[0] - 1), Math.floor(player.pos[1])];
      
    let enemy,
      i = this.unitsList.length;

    while (i--) {
      enemy = this.unitsList[i];

      if (enemy.id !== 1) {
        const path1 = this.path.get(this.map.map, enemy.pos, playerPos1),
          path2 = this.path.get(this.map.map, enemy.pos, playerPos2);

        if ((path1.length <= path2.length && path1.length !== 0) || path2.length === 0) {
          enemy.path = path1;
        } else {
          enemy.path = path2;
        }
      }
    }
  }
}
