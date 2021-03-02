import config from '../config.js';
import Units from '../view/Units.js';
import { Interactions } from './Interactions.js';
import { Map } from './Map.js';
import { drawImage } from './utils.js';

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
    this.items = data.itemPositions;
    this.map = new Map({
      map: this.blockedArr,
      units: this.unitsList
    });
    this.player = this.unitsList[0];
    this.interactions = new Interactions({
      unitsList: this.unitsList,
      map: this.map,
      playerSpeed: this.playerSpeed,
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      fieldWidth: config.fieldWidth,
      items: this.items
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

    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxGround1,
      array: this.ground1
    });
    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxGround2,
      array: this.ground2
    });
    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxTop1,
      array: this.top1
    });
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
      unit.secondary.update(delta);
      unit.skin.update(delta);
      unit.head.update(delta);
      unit.leg.update(delta);
      unit.torso.update(delta);
      unit.primary.update(delta);

      // Continue walking
      if (unit.path.length > 1 && !unit.friendly) {
        this.updateMoveAnimation(unit);

        // Stop walking
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
    let xNew = unit.pos[0],
      yNew = unit.pos[1];
    const centerOffset = 0.5;
    const walkDistance = (1 / unit.steps) * -(unit.currentStep - unit.steps);
    const path = unit.path;
    const xNext = unit.nextTile ? unit.nextTile[0] : path[1][0];
    const yNext = unit.nextTile ? unit.nextTile[1] : path[1][1];
    const xPath = unit.tile[0];
    const yPath = unit.tile[1];

    // Start of animation from tile to tile
    if (unit.currentStep === unit.steps) {
      // Find new path if next tile is blocked
      if (
        path.length > 1 &&
        this.map.map[path[1][1]][path[1][0]] !== 0 &&
        this.map.map[path[1][1]][path[1][0]] !== unit.id
      ) {
        this.interactions.setPath(this.player);
        return;
      }

      // Set next tile
      unit.nextTile = path[1];

      // Update blocked position
      this.map.updatePosition({
        x: xPath,
        y: yPath,
        newX: unit.nextTile[0],
        newY: unit.nextTile[1],
        unitId: unit.id
      });

      // Turn enemy
      if (this.player.pos[0] < xNext && unit.direction !== 'LEFT') {
        unit.turn('LEFT');
      }
      if (this.player.pos[0] > xNext && unit.direction !== 'RIGHT') {
        unit.turn('RIGHT');
      }
    }

    // Move top if next tile is above current
    if (yNext < yPath) {
      yNew = yPath + centerOffset - walkDistance;
    }

    // Move bottom if next tile is below current
    if (yNext > yPath) {
      yNew = yPath + centerOffset + walkDistance;
    }

    // Move left if next tile is on the left side of the current
    if (xNext < xPath) {
      xNew = xPath + centerOffset - walkDistance;
    }

    // Move right if next tile is on the right side of the current
    if (xNext > xPath) {
      xNew = xPath + centerOffset + walkDistance;
    }

    // End of an animation from tile to tile
    if (unit.currentStep === 1) {
      // Remove the first tile in the array
      unit.path.splice(0, 1);

      // Reset next tile
      if (unit.path.length === 1) {
        unit.nextTile = null;
      }

      // Reset to start animation for next tile
      unit.currentStep = unit.steps + 1;

      // Update next unit tile
      unit.tile = [xNext, yNext];
    }

    unit.pos = [xNew, yNew];
    unit.walk();
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
        list[i].secondary,
        list[i].skin,
        list[i].head,
        list[i].leg,
        list[i].torso,
        list[i].primary
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
