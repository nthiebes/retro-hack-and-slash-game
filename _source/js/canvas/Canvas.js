import config from '../config.js';
import Units from '../view/units.js';
import Interactions from './interactions.js';
import Map from './map.js';
import utils from './utils.js';

export default class Canvas {
  constructor(data) {
    this.ground1 = data.map[0];
    this.ground2 = data.map[1];
    this.top1 = data.map[2];
    this.blockedArr = data.map[3];
    this.rowTileCount = this.ground1.length;
    this.colTileCount = this.ground1[0].length;
    this.resources = data.resources;
    this.tileset = this.resources.get('images/tileset.png');
    this.lastTime = Date.now();
    this.gameTime = 0;
    this.units = new Units(data);
    this.unitsList = this.units.list;
    this.playerSpeed = this.unitsList[0].speed;
    this.map = new Map(this.blockedArr, this.unitsList);
    this.player = this.unitsList[0];
    this.interactions = new Interactions({
      unitsList: this.unitsList,
      blockedArr: this.blockedArr,
      map: this.map,
      playerSpeed: this.playerSpeed,
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      fieldWidth: config.fieldWidth
    });

    this.prepareCanvas();
    this.gameLoop();
  }

  prepareCanvas() {
    const canvas = document.querySelectorAll('canvas');

    for (let i = 0; i < canvas.length; i++) {
      canvas[i].width = this.colTileCount * config.fieldWidth;
      canvas[i].height = this.rowTileCount * config.fieldWidth;
    }

    utils.drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxGround1,
      array: this.ground1
    });
    utils.drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxGround2,
      array: this.ground2
    });
    utils.drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxTop1,
      array: this.top1
    });
    if (config.debug) {
      for (let r = 0; r < this.blockedArr.length; r++) {
        for (let c = 0; c < this.blockedArr[0].length; c++) {
          if (this.blockedArr[r][c] === 2) {
            utils.drawSquare({
              ctx: config.ctxTop1,
              color: 'rgba(0,0,0,0.5)',
              width: config.fieldWidth,
              height: config.fieldWidth,
              x: c * config.fieldWidth,
              y: r * config.fieldWidth
            });
          }
        }
      }
    }
  }

  gameLoop() {
    const now = Date.now(),
      delta = (now - this.lastTime) / 1000.0;

    this.update(delta);
    this.render();

    this.lastTime = now;

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  update(delta) {
    this.gameTime += delta;

    this.interactions.update(delta);
    this.updateEntities(delta);
  }

  updateEntities(delta) {
    const unitsList = this.unitsList;
    let unit;

    for (let i = 0, length = unitsList.length; i < length; i++) {
      unit = unitsList[i];
      unit.skin.update(delta);
      unit.head.update(delta);
      unit.leg.update(delta);
      unit.torso.update(delta);

      // Continue walking
      if (unit.path.length > 0 && !unit.friendly) {
        this.updateMoveAnimation(unit);
        // // Stop walking
      } else if (unit.moving && !unit.friendly) {
        unit.stop();
      }

      // Stop after animation
      if (
        unit.skin.frames.length === Math.floor(unit.skin.index) &&
        unit.skin.once
      ) {
        if (unit.attacking) {
          this.checkForHit();
        }

        unit.stop();
      }
    }
  }

  updateMoveAnimation(unit) {
    const path = unit.path;

    unit.moving = true;

    // Vertical movement
    if (unit.nextTile[0] === path[0][0]) {
      // Move top if next tile is above current
      if (unit.nextTile[1] > path[0][1]) {
        unit.pos[1] = path[0][1] + 0.5 + (1 / unit.steps) * unit.currentStep;

        // Move bottom if next tile is below current
      } else if (unit.nextTile[1] < path[0][1]) {
        unit.pos[1] = path[0][1] + 0.5 - (1 / unit.steps) * unit.currentStep;
      }

      // Horizontal movement
    } else {
      // Move left if next tile is on the left side of the current
      if (unit.nextTile[0] > path[0][0]) {
        unit.pos[0] = path[0][0] + 0.5 + (1 / unit.steps) * unit.currentStep;

        if (unit.direction !== 'LEFT') {
          unit.turn('LEFT');
        }
      }

      // Move right if next tile is on the right side of the current
      if (unit.nextTile[0] < path[0][0]) {
        unit.pos[0] = path[0][0] + 0.5 - (1 / unit.steps) * unit.currentStep;

        if (unit.direction !== 'RIGHT') {
          unit.turn('RIGHT');
        }
      }
    }

    unit.walk();

    // End of an animation from tile to tile
    if (unit.currentStep === 1) {
      unit.nextTile = path[0];
      // Remove the first tile in the array
      path.splice(0, 1);
      // Reset to start animation for next tile
      unit.currentStep = unit.steps;
    }

    unit.currentStep--;
  }

  checkForHit() {
    const unitsList = this.unitsList,
      player = this.player;
    let i = this.unitsList.length;

    while (i--) {
      const unit = unitsList[i];

      if (unit.id !== player.id) {
        const playerPosX = Math.round(config.fieldWidth * player.pos[0]),
          enemyPosX = Math.round(config.fieldWidth * unit.pos[0]),
          playerPosY = Math.round(config.fieldWidth * player.pos[1]),
          enemyPosY = Math.round(config.fieldWidth * unit.pos[1]),
          playerWidth = 40,
          playerHeight = 50;

        if (
          playerPosY > enemyPosY - playerHeight / 2 &&
          playerPosY < enemyPosY + playerHeight / 2
        ) {
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
    const tempUnitList = this.getTempUnitList(this.unitsList);

    // Clear canvas hack
    // eslint-disable-next-line no-self-assign
    config.canvasAnim.width = config.canvasAnim.width;
    this.renderEntities(tempUnitList);
  }

  renderEntities(list) {
    for (let i = 0; i < list.length; i++) {
      this.renderEntity(list[i], [
        list[i].skin,
        list[i].head,
        list[i].leg,
        list[i].torso
      ]);
    }
  }

  renderEntity(unit, bodyParts) {
    config.ctxAnim.save();

    if (config.debug) {
      this.map.showDebugFields({
        ctx: config.ctxAnim,
        unit: unit,
        units: this.unitsList
      });
    }

    config.ctxAnim.translate(
      unit.pos[0] * config.fieldWidth - 64,
      unit.pos[1] * config.fieldWidth - 125
    );

    for (let i = 0; i < bodyParts.length; i++) {
      bodyParts[i].render(config.ctxAnim, this.resources);
    }

    config.ctxAnim.restore();
  }

  getTempUnitList(unitsList) {
    const tempUnitList = [];
    let i = unitsList.length;

    while (i--) {
      tempUnitList.push(unitsList[i]);
    }

    tempUnitList.sort((a, b) => a.pos[1] - b.pos[1]);

    return tempUnitList;
  }
}