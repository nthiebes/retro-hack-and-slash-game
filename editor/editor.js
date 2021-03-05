import Resources from '../game/js/utils/Resources.js';
import config from '../game/js/config.js';
import { drawImage, drawSquare } from '../game/js/canvas/utils.js';

const newMapForm = document.getElementById('new-map');
const canvasWrapper = document.getElementById('canvas-wrapper');
const layer = document.getElementById('layer');
const ground1 = document.getElementById('ground1');
const ground2 = document.getElementById('ground2');
// const anim = document.getElementById('anim');
const top1 = document.getElementById('top1');
const blocked = document.getElementById('blocked');
const blockedCanvas = document.getElementById('canvas-blocked');
const ctxBlocked = blockedCanvas.getContext('2d');
const events = document.getElementById('events');
const eventsCanvas = document.getElementById('canvas-events');
const ctxEvents = eventsCanvas.getContext('2d');
const canvas = document.querySelectorAll('canvas');
const size = document.getElementById('size');
const tileset = document.getElementById('tileset');
const activeTilesetTile = document.getElementById('tileset-tile');
const activeMapTile = document.getElementById('map-tile');
const mapJson = document.getElementById('map-json');
const generate = document.getElementById('generate');
const name = document.getElementById('name');
const blockedTiles = document.getElementById('blocked-tiles');
const eventTiles = document.getElementById('event');
const opaque = document.getElementById('opaque');
const obscure = document.getElementById('obscure');
const eventPlayer = document.getElementById('event-player');
const eventEnemy = document.getElementById('event-enemy');
const eventItem = document.getElementById('event-item');
const enemyIds = document.getElementById('enemy-ids');
const enemyOptions = document.getElementById('event-options-enemy');
const itemOptions = document.getElementById('event-options-item');
const itemIds = document.getElementById('item-ids');
const loadButton = document.getElementById('load-map');
const ground = document.getElementById('ground');
const resources = new Resources();
const resourcesList = ['../game/images/tileset.png'];
let enemies = [];
let items = [];

class Editor {
  constructor(data) {
    this.ground1 = data.map[0];
    this.ground2 = data.map[1];
    this.top1 = data.map[2];
    this.blocked = data.map[3];
    this.rowTileCount = this.ground1.length;
    this.colTileCount = this.ground1[0].length;
    this.resources = data.resources;
    this.tileset = this.resources.get('../game/images/tileset.png');
    this.lastTime = Date.now();
    this.gameTime = 0;
    this.tileNumber = 0;
    this.mousePressed = false;
    this.x = 0;
    this.y = 0;
    this.activeLayer = 'ground1';
    this.activeEvent = 'player';
    this.blockedType = 'opaque';
    this.playerList = data.playerList || [];
    this.enemyList = data.enemyList || [];
    this.itemList = data.itemList || [];

    activeMapTile.classList.add('canvas__active--show');

    this.drawMapLayers();
    this.addEventListeners();
  }

  drawMapLayers() {
    for (let i = 0; i < canvas.length; i++) {
      canvas[i].width = this.colTileCount * config.fieldWidth;
      canvas[i].height = this.rowTileCount * config.fieldWidth;
    }

    this.drawGround1();
    this.drawGround2();
    this.drawTop1();
    this.drawBlocked();
    this.drawEvents();
  }

  drawGround1() {
    // eslint-disable-next-line no-self-assign
    config.canvasGround1.width = config.canvasGround1.width;

    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxGround1,
      array: this.ground1
    });
  }

  drawGround2() {
    // eslint-disable-next-line no-self-assign
    config.canvasGround2.width = config.canvasGround2.width;

    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxGround2,
      array: this.ground2
    });
  }

  drawTop1() {
    // eslint-disable-next-line no-self-assign
    config.canvasTop1.width = config.canvasTop1.width;

    drawImage({
      rowTileCount: this.rowTileCount,
      colTileCount: this.colTileCount,
      tileset: this.tileset,
      ctx: config.ctxTop1,
      array: this.top1
    });
  }

  drawBlocked() {
    // eslint-disable-next-line no-self-assign
    blockedCanvas.width = blockedCanvas.width;

    for (let r = 0; r < this.blocked.length; r++) {
      for (let c = 0; c < this.blocked[0].length; c++) {
        if (this.blocked[r][c] !== 0) {
          drawSquare({
            ctx: ctxBlocked,
            color:
              this.blocked[r][c] === 1
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(0,0,0,0.5)',
            width: config.fieldWidth,
            height: config.fieldWidth,
            x: c * config.fieldWidth,
            y: r * config.fieldWidth
          });
        }
      }
    }
  }

  drawEvents() {
    // eslint-disable-next-line no-self-assign
    eventsCanvas.width = eventsCanvas.width;

    for (let i = 0; i < this.playerList.length; i++) {
      const player = this.playerList[i];

      drawSquare({
        ctx: ctxEvents,
        color: 'rgba(0,255,0,0.5)',
        width: config.fieldWidth,
        height: config.fieldWidth,
        x: player[0] * config.fieldWidth,
        y: player[1] * config.fieldWidth
      });
    }

    for (let i = 0; i < this.enemyList.length; i++) {
      const enemy = this.enemyList[i];

      drawSquare({
        ctx: ctxEvents,
        color: 'rgba(255,0,0,0.5)',
        width: config.fieldWidth,
        height: config.fieldWidth,
        x: enemy.pos[0] * config.fieldWidth,
        y: enemy.pos[1] * config.fieldWidth
      });
    }

    for (let i = 0; i < this.itemList.length; i++) {
      const item = this.itemList[i];

      drawSquare({
        ctx: ctxEvents,
        color: 'rgba(0,0,255,0.5)',
        width: config.fieldWidth,
        height: config.fieldWidth,
        x: item.pos[0] * config.fieldWidth,
        y: item.pos[1] * config.fieldWidth
      });
    }
  }

  drawActiveLayer() {
    if (this.activeLayer === 'ground1') {
      this.drawGround1();
    }

    if (this.activeLayer === 'ground2') {
      this.drawGround2();
    }

    if (this.activeLayer === 'top1') {
      this.drawTop1();
    }

    if (this.activeLayer === 'blocked') {
      this.drawBlocked();
    }

    if (this.activeLayer === 'events') {
      this.drawEvents();
    }
  }

  paintTile = (x, y) => {
    if (this.activeLayer === 'blocked') {
      if (this[this.activeLayer][y][x] === 0) {
        this[this.activeLayer][y][x] = this.blockedType === 'opaque' ? 1 : 2;
      } else {
        this[this.activeLayer][y][x] = 0;
      }
    } else if (this.activeLayer === 'events') {
      if (this.activeEvent === 'player') {
        const playerIndex = this.playerList.findIndex(
          (player) => player[0] === x && player[1] === y
        );

        if (playerIndex === -1) {
          this.playerList.push([x, y]);
        } else {
          this.playerList.splice(playerIndex, 1);
        }
      } else if (this.activeEvent === 'enemy') {
        const enemyIndex = this.enemyList.findIndex(
          ({ pos }) => pos[0] === x && pos[1] === y
        );

        if (enemyIndex === -1) {
          this.enemyList.push({ pos: [x, y], id: enemyIds.value });
        } else {
          this.enemyList.splice(enemyIndex, 1);
        }
      } else if (this.activeEvent === 'item') {
        const itemIndex = this.itemList.findIndex(
          ({ pos }) => pos[0] === x && pos[1] === y
        );

        if (itemIndex === -1) {
          this.itemList.push({ pos: [x, y], id: itemIds.value });
        } else {
          this.itemList.splice(itemIndex, 1);
        }
      }
    } else {
      this[this.activeLayer][y][x] = this.tileNumber;
    }

    this.drawActiveLayer();
  };

  addEventListeners() {
    tileset.addEventListener('click', (event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const x = Math.floor(offsetX / config.fieldWidth);
      const y = Math.floor(offsetY / config.fieldWidth);

      this.tileNumber = x + y * 16;

      activeTilesetTile.style.left = `${x * config.fieldWidth}px`;
      activeTilesetTile.style.top = `${y * config.fieldWidth}px`;
    });

    canvasWrapper.addEventListener('click', (event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const x = Math.floor(offsetX / config.fieldWidth);
      const y = Math.floor(offsetY / config.fieldWidth);

      this.paintTile(x, y);
    });

    canvasWrapper.addEventListener('mousedown', () => {
      this.mousePressed = true;
    });

    canvasWrapper.addEventListener('mouseup', () => {
      this.mousePressed = false;
    });

    canvasWrapper.addEventListener('mousemove', (event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const x = Math.floor(offsetX / config.fieldWidth);
      const y = Math.floor(offsetY / config.fieldWidth);

      if (
        this.mousePressed &&
        this.activeLayer !== 'events' &&
        (x !== this.x || y !== this.y)
      ) {
        this.x = x;
        this.y = y;
        this.paintTile(x, y);
      }

      activeMapTile.style.left = `${x * config.fieldWidth}px`;
      activeMapTile.style.top = `${y * config.fieldWidth}px`;
    });

    ground1.addEventListener('click', this.handleGround1Click);
    ground2.addEventListener('click', this.handleGround2Click);
    // anim.addEventListener('click', this.handleLayerClick);
    top1.addEventListener('click', this.handleTop1Click);
    events.addEventListener('click', this.handleEventsClick);
    blocked.addEventListener('click', this.handleBlockedClick);

    generate.addEventListener('submit', this.generateMap);
    obscure.addEventListener('click', this.handleObscure);
    opaque.addEventListener('click', this.handleOpaque);
    eventPlayer.addEventListener('click', this.handleEvent);
    eventEnemy.addEventListener('click', this.handleEvent);
    eventItem.addEventListener('click', this.handleEvent);
  }

  handleEvent = (event) => {
    const id = event.target.id;

    eventPlayer.classList.remove('event__item--active');
    eventEnemy.classList.remove('event__item--active');
    eventItem.classList.remove('event__item--active');
    enemyOptions.classList.remove('event__options--show');
    itemOptions.classList.remove('event__options--show');

    if (id === 'event-player') {
      eventPlayer.classList.add('event__item--active');
      this.activeEvent = 'player';
    }
    if (id === 'event-enemy') {
      eventEnemy.classList.add('event__item--active');
      enemyOptions.classList.add('event__options--show');
      this.activeEvent = 'enemy';
    }
    if (id === 'event-item') {
      eventItem.classList.add('event__item--active');
      itemOptions.classList.add('event__options--show');
      this.activeEvent = 'item';
    }
  };

  generateMap = (event) => {
    const map = {
      name: name.value,
      players: this.playerList,
      enemies: this.enemyList,
      items: this.itemList,
      map: [this.ground1, this.ground2, this.top1, this.blocked]
    };
    const mapString = JSON.stringify(map);

    event.preventDefault();

    mapJson.value = mapString;
    navigator.clipboard.writeText(mapString);
  };

  handleObscure = () => {
    opaque.classList.remove('blocked-tiles__tile--active');
    obscure.classList.add('blocked-tiles__tile--active');

    this.blockedType = 'obscure';
  };

  handleOpaque = () => {
    opaque.classList.add('blocked-tiles__tile--active');
    obscure.classList.remove('blocked-tiles__tile--active');

    this.blockedType = 'opaque';
  };

  handleLayerClick = (event) => {
    const newLayer = event.target;
    const oldLayer = document.getElementById(this.activeLayer);

    event.stopPropagation();
    oldLayer.classList.remove('layer__button--active');
    newLayer.classList.add('layer__button--active');
    config.canvasGround1.classList.add('canvas__layer--show');
    config.canvasGround2.classList.add('canvas__layer--show');
    config.canvasTop1.classList.add('canvas__layer--show');
    eventsCanvas.classList.add('canvas__layer--show');
    blockedCanvas.classList.add('canvas__layer--show');
    tileset.classList.remove('tileset--show');
    eventTiles.classList.remove('event--show');
    blockedTiles.classList.remove('blocked-tiles--show');
    this.activeLayer = newLayer.id;
  };

  handleGround1Click = (event) => {
    this.handleLayerClick(event);

    config.canvasGround2.classList.remove('canvas__layer--show');
    config.canvasTop1.classList.remove('canvas__layer--show');
    eventsCanvas.classList.remove('canvas__layer--show');
    blockedCanvas.classList.remove('canvas__layer--show');
    tileset.classList.add('tileset--show');
  };

  handleGround2Click = (event) => {
    this.handleLayerClick(event);

    config.canvasTop1.classList.remove('canvas__layer--show');
    eventsCanvas.classList.remove('canvas__layer--show');
    blockedCanvas.classList.remove('canvas__layer--show');
    tileset.classList.add('tileset--show');
  };

  handleTop1Click = (event) => {
    this.handleLayerClick(event);

    eventsCanvas.classList.remove('canvas__layer--show');
    blockedCanvas.classList.remove('canvas__layer--show');
    tileset.classList.add('tileset--show');
  };

  handleEventsClick = (event) => {
    this.handleLayerClick(event);

    blockedCanvas.classList.remove('canvas__layer--show');
    eventTiles.classList.add('event--show');
  };

  handleBlockedClick = (event) => {
    this.handleLayerClick(event);

    blockedTiles.classList.add('blocked-tiles--show');
  };
}

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    loadButton.addEventListener('click', () => {
      const {
        map,
        enemies: enemyList,
        items: itemList,
        players,
        name: mapName
      } = JSON.parse(mapJson.value);
      // eslint-disable-next-line no-unused-vars
      const editor = new Editor({
        resources,
        enemyList,
        playerList: players,
        itemList,
        map: [map[0], map[1], map[2], map[3]]
      });

      name.value = mapName;
      newMapForm.classList.add('new-map--hide');
      layer.classList.add('layer--show');
    });
    newMapForm.addEventListener('submit', (event) => {
      const mapSize = Number(size.value);
      const groundValue = Number(ground.value);
      const mapGround1 = new Array(mapSize)
        .fill(0)
        .map(() => new Array(mapSize).fill(groundValue));
      const mapGround2 = new Array(mapSize)
        .fill(0)
        .map(() => new Array(mapSize).fill(0));
      const mapTop1 = new Array(mapSize)
        .fill(0)
        .map(() => new Array(mapSize).fill(0));
      let mapBlocked = new Array(mapSize).fill(0);

      mapBlocked = mapBlocked.map((_, index) => {
        if (index === 0 || index === mapBlocked.length - 1) {
          return new Array(mapSize).fill(2);
        }
        const innerBlocked = new Array(mapSize).fill(0);

        return innerBlocked.map((value, i) => {
          if (i === 0 || i === innerBlocked.length - 1) {
            return 2;
          }
          return value;
        });
      });

      event.preventDefault();
      newMapForm.classList.add('new-map--hide');
      layer.classList.add('layer--show');

      // eslint-disable-next-line no-unused-vars
      const editor = new Editor({
        resources,
        map: [mapGround1, mapGround2, mapTop1, mapBlocked]
      });
    });

    fetch('../game/data/enemies.json')
      .then((response) => response.json())
      .then((data) => {
        enemies = data.list;

        for (let i = 0; i < enemies.length; i++) {
          const option = document.createElement('option');

          option.value = enemies[i].id;
          option.innerHTML = enemies[i].name;
          enemyIds.append(option);
        }
      });
    fetch('../game/data/armor.json')
      .then((response) => response.json())
      .then((data) => {
        items = data.list.filter(({ type }) => type !== 'none');

        for (let i = 0; i < items.length; i++) {
          const option = document.createElement('option');

          option.value = items[i].id;
          option.innerHTML = items[i].name;
          itemIds.append(option);
        }
      });
    fetch('../game/data/weapons.json')
      .then((response) => response.json())
      .then((data) => {
        items = data.list.filter(({ id }) => id !== 'first');

        for (let i = 0; i < items.length; i++) {
          const option = document.createElement('option');

          option.value = items[i].id;
          option.innerHTML = items[i].name;
          itemIds.append(option);
        }
      });
  });
};
