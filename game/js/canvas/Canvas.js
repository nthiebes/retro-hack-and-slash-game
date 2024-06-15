import config from '../config.js';
import { Units } from '../units/units.js';
import { Animations } from '../animations/animations.js';
import { Events } from '../events/events.js';
import { combat } from '../units/utils.js';
import { Interactions } from './Interactions.js';
import { Map } from '../map/Map.js';
import { getPath } from '../map/path.js';
import { socket } from '../utils/socket.js';
import { drawImage, drawText } from './utils.js';
import { sounds } from '../utils/sounds.js';

export default class Canvas {
  constructor(data) {
    Units.addUnits({
      player: data.player,
      players: data.players,
      enemies: data.enemies
    });

    Animations.addAnimations(data.animations);
    Events.addEvents(data.events);

    this.ground1 = data.map[0];
    this.ground2 = data.map[1];
    this.top1 = data.map[2];
    this.rowTileCount = this.ground1.length;
    this.colTileCount = this.ground1[0].length;
    this.resources = data.resources;
    this.tileset = this.resources.get('images/tileset.png');
    this.lastTime = Date.now();
    this.gameTime = 0;
    this.mapEvents = data.mapEvents;
    this.map = new Map({
      map: data.map[3],
      units: Units.list
    });
    this.interactions = new Interactions({
      map: this.map,
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      fieldWidth: config.fieldWidth,
      mapEvents: this.mapEvents
    });

    // Fill fields in sight for all units
    for (let i = 0; i < Units.list.length; i++) {
      const unit = Units.list[i];

      unit.fieldsInSight = this.map.getFieldsInSight(unit.pos, unit.direction);
    }

    // Play item animations that already ran
    Animations.list.forEach((animation) => {
      if (!Events.getEventByPos({ x: animation.pos[0], y: animation.pos[1] })) {
        animation.play();
      }
    });

    this.prepareCanvas();
    this.drawMinimap();
    this.gameLoop();

    socket.on('player-joined', ({ newPlayer }) => {
      if (config.debug) {
        console.log('👤➕');
      }
      const newPlayerPosAdjusted = {
        ...newPlayer,
        pos: [
          newPlayer.pos[0] - Units.player.chunk[0] * 30,
          newPlayer.pos[1] - Units.player.chunk[1] * 30
        ]
      };

      Units.addUnit(newPlayerPosAdjusted);
    });

    socket.on('player-left', ({ playerId }) => {
      if (config.debug) {
        console.log('👤➖');
      }

      Units.list = Units.list.filter(({ id }) => id !== playerId);
    });

    socket.on('player-moved', ({ playerId, pos }) => {
      if (config.debug) {
        console.log('👤🚶‍♂️');
      }

      const friendlyPlayer = Units.list.find((unit) => unit.id === playerId);
      const newPos = [
        pos[0] + friendlyPlayer.chunk[0] * 30 - Units.player.chunk[0] * 30,
        pos[1] + friendlyPlayer.chunk[1] * 30 - Units.player.chunk[1] * 30
      ];

      friendlyPlayer.path = getPath({
        world: this.map.map,
        pathStart: [
          Math.floor(friendlyPlayer.pos[0]),
          Math.floor(friendlyPlayer.pos[1])
        ],
        pathEnd: newPos,
        unitId: playerId
      });
    });

    socket.on('player-turned', ({ playerId, direction }) => {
      if (config.debug) {
        console.log('👤👈👉');
      }

      Units.list.find(({ id }) => id === playerId).turn(direction);
    });

    socket.on('player-attacked', ({ playerId }) => {
      if (config.debug) {
        console.log('👤⚔');
      }

      Units.list.find(({ id }) => id === playerId).attack();
    });

    socket.on('player-stopped-attack', ({ playerId }) => {
      if (config.debug) {
        console.log('👤✋');
      }

      Units.list.find(({ id }) => id === playerId).skin.once = true;
    });

    socket.on('player-took-item', ({ playerId, item }) => {
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

      Units.list.find(({ id }) => id === playerId).takeItem({ id: item.id });
      Events.removeEvent(item);
    });

    socket.on('ai-moved', ({ id, path }) => {
      if (config.debug) {
        console.log('🤖🚶‍♂️');
      }

      const enemy = Units.list.find((unit) => unit.id === id);

      if (enemy) {
        enemy.path = path;
      }
    });

    socket.on('map-data', ({ direction, mapData, chunk, playerId }) => {
      if (config.debug) {
        console.log('🗺️');
      }

      if (!this.interactions.serverRequestInProgress) {
        Units.list.find((unit) => unit.id === playerId).chunk = chunk;
        return;
      }

      Units.player.chunk = chunk;

      Units.list.forEach((unit) => {
        switch (direction) {
          case 'right': {
            unit.pos = [unit.pos[0] - config.chunkSize, unit.pos[1]];
            break;
          }
          case 'left': {
            unit.pos = [unit.pos[0] + config.chunkSize, unit.pos[1]];
            break;
          }
          case 'bottom': {
            unit.pos = [unit.pos[0], unit.pos[1] - config.chunkSize];
            break;
          }
          default: {
            unit.pos = [unit.pos[0], unit.pos[1] + config.chunkSize];
          }
        }

        unit.path = [];
        unit.tile = [Math.floor(unit.pos[0]), Math.floor(unit.pos[1])];
        unit.nextTile = null;
      });

      // Remove already existing enemies
      const newUnits = mapData.enemies.filter((enemy) =>
        Boolean(!Units.getUnit(enemy.id))
      );

      Units.addUnits({
        players: [],
        enemies: newUnits
      });

      this.ground1 = mapData.map[0];
      this.ground2 = mapData.map[1];
      this.top1 = mapData.map[2];
      this.map.updateMap({ map: mapData.map[3], enemies: mapData.enemies });
      this.interactions.resetOffset();
      this.interactions.updateMap(this.map);
      this.interactions.setServerRequestInProgress(false);
      Events.updateEvents(mapData.events);
      Animations.updateAnimations(mapData.animations);

      // Fill fields in sight for all units
      for (let i = 0; i < Units.list.length; i++) {
        const unit = Units.list[i];

        unit.fieldsInSight = this.map.getFieldsInSight(
          unit.pos,
          unit.direction
        );
      }
      this.interactions.setPath();

      this.drawMap();
      this.drawMinimap();
    });
  }

  prepareCanvas() {
    const canvas = document.querySelectorAll('.map-layer');

    for (let i = 0; i < canvas.length; i++) {
      canvas[i].width = this.colTileCount * config.fieldWidth;
      canvas[i].height = this.rowTileCount * config.fieldWidth;
    }

    this.drawMap();
  }

  drawMap() {
    // Clear canvas
    config.ctxGround1.clearRect(
      0,
      0,
      config.ctxGround1.canvas.width,
      config.ctxGround1.canvas.height
    );
    config.ctxGround2.clearRect(
      0,
      0,
      config.ctxGround2.canvas.width,
      config.ctxGround2.canvas.height
    );
    config.ctxTop1.clearRect(
      0,
      0,
      config.ctxTop1.canvas.width,
      config.ctxTop1.canvas.height
    );

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

  drawMinimap() {
    const fieldWidth = 7.2;

    config.ctxMinimap.clearRect(
      0,
      0,
      config.ctxMinimap.canvas.width,
      config.ctxMinimap.canvas.height
    );

    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxMinimap,
      array: this.ground1,
      fieldWidth
    });
    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxMinimap,
      array: this.ground2,
      fieldWidth
    });
    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxMinimap,
      array: this.top1,
      fieldWidth
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
      unit.hair.update(delta);
      unit.face.update(delta);

      // Continue walking
      if (unit.path.length > 1) {
        this.updateMoveAnimation(unit);

        // Stop walking
      } else if (unit.moving && unit.id !== Units.player.id) {
        if (unit.attacking) {
          unit.moving = false;
        } else {
          unit.stop();
        }
      }

      // End of animation
      if (unit.skin.frames.length === Math.floor(unit.skin.index)) {
        if (unit.attacking) {
          combat({ units: Units, map: this.map, attacker: unit });

          if (!unit.skin.once) {
            sounds.swing();
          }
        }

        if (unit.skin.once) {
          unit.stop();
        }
      }
    }
  }

  // eslint-disable-next-line complexity
  updateMoveAnimation(unit) {
    const targetUnit = Units.getUnit(unit.target) || Units.player;
    let xNew = unit.pos[0],
      yNew = unit.pos[1];
    const centerOffset = 0.5;
    const walkDistance = (1 / unit.steps) * -(unit.currentStep - unit.steps); // One step * current steps
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
        this.map.map[path[1][1]][path[1][0]] !== unit.id &&
        !unit.friendly
      ) {
        if (targetUnit.dead) {
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
        targetUnit.pos[0] < xNext &&
        unit.direction !== 'LEFT' &&
        !unit.friendly
      ) {
        unit.turn('LEFT');
      }
      if (
        targetUnit.pos[0] > xNext &&
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
        !targetUnit.dead &&
        unit.path.length === 1 &&
        !unit.friendly &&
        yNext === Math.floor(targetUnit.pos[1]) &&
        (xNext === Math.floor(targetUnit.pos[0]) + 1 ||
          xNext === Math.floor(targetUnit.pos[0]) - 1)
      ) {
        unit.attack();
      }
      // New path if enemy stops and player is in sight again
      else if (
        unit.isPlayerInSight(targetUnit.pos) &&
        unit.path.length === 1 &&
        !unit.friendly
      ) {
        this.interactions.setPath(unit.id);
        // Enemy lost sight
      } else if (unit.path.length === 1) {
        sounds.battle.stop();
      }

      // Stop attacking when player has moved
      if (unit.attacking && unit.path.length > 1) {
        unit.attacking = false;
      }
    }

    unit.pos = [
      // this.interactions.getSmoothPixelValue(xNew),
      // this.interactions.getSmoothPixelValue(yNew)
      xNew,
      yNew
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
    const itemEvents = Events.list.filter((event) => event.type === 'item');

    for (let i = 0; i < itemEvents.length; i++) {
      this.renderItem(itemEvents[i]);
    }

    for (let i = 0; i < Animations.list.length; i++) {
      this.renderAnimation(Animations.list[i]);
    }

    for (let i = 0; i < unitList.length; i++) {
      const noHair = unitList[i].noHair;
      const noFace = unitList[i].noFace;

      if (noHair) {
        unitList[i].hair.url = 'images/hair/human/hair0.png';
      }
      if (noFace) {
        unitList[i].face.url = 'images/hair/human/hair0.png';
      }

      this.renderUnit(unitList[i], [
        unitList[i].primary,
        unitList[i].skin,
        unitList[i].face,
        unitList[i].hair,
        unitList[i].torso,
        unitList[i].leg,
        unitList[i].head,
        unitList[i].special,
        unitList[i].secondary
      ]);
    }
  }

  renderItem(item) {
    config.ctxAnim.save();

    config.ctxAnim.translate(
      item.pos[0] * config.fieldWidth - config.fieldWidth + 90,
      item.pos[1] * config.fieldWidth - config.fieldWidth + 100
    );
    item.sprite.render(config.ctxAnim, this.resources, null, 0.5);

    config.ctxAnim.restore();
  }

  renderAnimation(animation) {
    config.ctxAnim.save();

    config.ctxAnim.translate(
      animation.pos[0] * config.fieldWidth + 25,
      animation.pos[1] * config.fieldWidth + 55
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
      bodyParts[i].render(config.ctxAnim, this.resources, unit.direction);
    }

    if (unit.id !== Units.player.id && unit.friendly) {
      drawText({
        ctx: config.ctxAnim,
        x: 62,
        y: -8,
        text: unit.name,
        color: '#fff'
      });
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
