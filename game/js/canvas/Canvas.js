import config from '../config.js';
import { Units } from '../units/units.js';
import { Animations } from '../animations/animations.js';
import { combat } from '../units/utils.js';
import { Interactions } from './Interactions.js';
import { Map } from '../map/Map.js';
import { socket } from '../utils/socket.js';
import { drawImage } from './utils.js';

export default class Canvas {
  constructor(data) {
    Units.addUnits({
      player: data.player,
      players: data.players,
      enemies: data.enemies
    });
    Animations.addAnimations(data.animations);

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
    this.items = data.items;
    this.mapItems = data.mapItems;
    this.map = new Map({
      map: this.blockedArr,
      units: Units.list
    });
    this.interactions = new Interactions({
      map: this.map,
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      fieldWidth: config.fieldWidth,
      items: this.items,
      mapItems: this.mapItems
    });

    // Fill fields in sight for all units
    for (let i = 0; i < Units.list.length; i++) {
      const unit = Units.list[i];

      unit.fieldsInSight = this.map.getFieldsInSight(unit.pos, unit.direction);
    }

    this.prepareCanvas();
    this.gameLoop();

    socket.on('player-joined', ({ newPlayer }) => {
      if (Units.player.id !== newPlayer.id) {
        if (config.debug) {
          console.log('👤➕');
        }

        Units.addUnit(newPlayer);
      }
    });

    socket.on('player-left', ({ playerId }) => {
      if (config.debug) {
        console.log('👤➖');
      }

      Units.list = Units.list.filter(({ id }) => id !== playerId);
    });

    socket.on('player-moved', ({ playerId, path }) => {
      if (Units.player.id !== playerId) {
        if (config.debug) {
          console.log('👤🚶‍♂️');
        }

        Units.list.find(({ id }) => id === playerId).path = path;
      }
    });

    socket.on('player-turned', ({ playerId, direction }) => {
      if (Units.player.id !== playerId) {
        if (config.debug) {
          console.log('👤👈👉');
        }

        Units.list.find(({ id }) => id === playerId).turn(direction);
      }
    });

    socket.on('player-attacked', ({ playerId }) => {
      if (Units.player.id !== playerId) {
        if (config.debug) {
          console.log('👤⚔');
        }

        Units.list.find(({ id }) => id === playerId).attack();
      }
    });

    socket.on('player-stopped-attack', ({ playerId }) => {
      if (Units.player.id !== playerId) {
        if (config.debug) {
          console.log('👤✋');
        }

        Units.list.find(({ id }) => id === playerId).skin.once = true;
      }
    });

    socket.on('player-equipped', ({ playerId, item }) => {
      if (Units.player.id !== playerId) {
        if (config.debug) {
          console.log('👤🛡️');
        }

        const animation = Animations.getAnimation({
          x: item.pos[0],
          y: item.pos[1]
        });

        if (animation) {
          animation.play();
        }
        Units.list.find(({ id }) => id === playerId).equip({ id: item.id });

        // this.items = this.items.filter((mapItem) => mapItem.id !== item.id);
      }
    });
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
    const unitsList = Units.list;
    let unit;

    for (let i = 0, length = Animations.list.length; i < length; i++) {
      Animations.list[i].sprite.update(delta);
    }

    for (let i = 0, length = unitsList.length; i < length; i++) {
      unit = unitsList[i];
      unit.secondary.update(delta);
      unit.skin.update(delta);
      unit.head.update(delta);
      unit.leg.update(delta);
      unit.torso.update(delta);
      unit.primary.update(delta);
      unit.special.update(delta);

      // Continue walking
      if (unit.path.length > 1) {
        this.updateMoveAnimation(unit);

        // Stop walking
      } else if (unit.moving && unit.id !== Units.player.id) {
        unit.stop();
      }

      // End of animation
      if (unit.skin.frames.length === Math.floor(unit.skin.index)) {
        if (unit.attacking) {
          combat({ units: Units, map: this.map, attacker: unit });
        }

        if (unit.skin.once) {
          unit.stop();
        }
      }
    }
  }

  // eslint-disable-next-line complexity
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
        if (Units.player.dead) {
          unit.path = [];
        }

        this.interactions.setPath(unit.id);

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
      if (
        Units.player.pos[0] < xNext &&
        unit.direction !== 'LEFT' &&
        !unit.friendly
      ) {
        unit.turn('LEFT');
      }
      if (
        Units.player.pos[0] > xNext &&
        unit.direction !== 'RIGHT' &&
        !unit.friendly
      ) {
        unit.turn('RIGHT');
      }

      unit.walk();
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

      // Update fields in sight
      unit.fieldsInSight = this.map.getFieldsInSight(unit.tile, unit.direction);

      // Attack if player is in range
      if (
        !Units.player.dead &&
        unit.path.length === 1 &&
        !unit.friendly &&
        yNext === Math.floor(Units.player.pos[1]) &&
        (xNext === Math.floor(Units.player.pos[0]) + 1 ||
          xNext === Math.floor(Units.player.pos[0]) - 1)
      ) {
        unit.attack();
      }
      // New path if enemy stops and player is in sight again
      else if (
        unit.isPlayerInSight(Units.player.pos) &&
        unit.path.length === 1
      ) {
        this.interactions.setPath(unit.id);
      }
    }

    unit.pos = [
      this.interactions.getSmoothPixelValue(xNew),
      this.interactions.getSmoothPixelValue(yNew)
    ];
    unit.currentStep--;
  }

  render() {
    const tempUnitList = this.getTempUnitList(Units.list);
    const ctx = config.ctxAnim;

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.renderEntities(tempUnitList);
  }

  renderEntities(unitList) {
    for (let i = 0; i < Animations.list.length; i++) {
      this.renderAnimation(Animations.list[i]);
    }

    for (let i = 0; i < unitList.length; i++) {
      this.renderUnit(unitList[i], [
        unitList[i].secondary,
        unitList[i].skin,
        unitList[i].head,
        unitList[i].leg,
        unitList[i].torso,
        unitList[i].primary,
        unitList[i].special
      ]);
    }
  }

  renderAnimation(animation) {
    config.ctxAnim.save();

    config.ctxAnim.translate(
      animation.pos[0] * config.fieldWidth,
      animation.pos[1] * config.fieldWidth
    );
    animation.sprite.render(config.ctxAnim, this.resources);

    config.ctxAnim.restore();
  }

  renderUnit(unit, bodyParts) {
    config.ctxAnim.save();

    if (config.debug) {
      this.map.showDebugFields({
        ctx: config.ctxAnim,
        unit: unit,
        units: Units.list
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
