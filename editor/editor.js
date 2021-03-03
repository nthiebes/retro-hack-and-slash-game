import Resources from '../game/js/utils/Resources.js';
import config from '../game/js/config.js';
import { drawImage } from '../game/js/canvas/utils.js';

const newMapForm = document.getElementById('new-map');
const canvasWrapper = document.getElementById('canvas-wrapper');
const layer = document.getElementById('layer');
const ground1 = document.getElementById('ground1');
const ground2 = document.getElementById('ground2');
const anim = document.getElementById('anim');
const top1 = document.getElementById('top1');
const canvas = document.querySelectorAll('canvas');
const size = document.getElementById('size');
const tileset = document.getElementById('tileset');
const activeTilesetTile = document.getElementById('tileset-tile');
const activeMapTile = document.getElementById('map-tile');
const resources = new Resources();
const resourcesList = ['../game/images/tileset.png'];

class Editor {
  constructor(data) {
    this.ground1 = data.map.map[0];
    this.ground2 = data.map.map[1];
    this.top1 = data.map.map[2];
    this.anim = data.map.map[3];
    this.rowTileCount = this.ground1.length;
    this.colTileCount = this.ground1[0].length;
    this.resources = data.resources;
    this.tileset = this.resources.get('../game/images/tileset.png');
    this.lastTime = Date.now();
    this.gameTime = 0;
    this.tileNumber = 0;
    this.activeLayer = 'ground1';
    this.mousePressed = false;
    this.x = 0;
    this.y = 0;

    activeMapTile.classList.add('canvas__active--show');

    this.drawMapLayers();
    this.gameLoop();
    this.addEventListeners();
  }

  drawMapLayers() {
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

      this[this.activeLayer][y][x] = this.tileNumber;
      this.drawMapLayers();
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

      if (this.mousePressed && (x !== this.x || y !== this.y)) {
        this.x = x;
        this.y = y;
        this[this.activeLayer][y][x] = this.tileNumber;
        this.drawMapLayers();
      }

      activeMapTile.style.left = `${x * config.fieldWidth}px`;
      activeMapTile.style.top = `${y * config.fieldWidth}px`;
    });

    ground1.addEventListener('click', this.handleLayerClick);
    ground2.addEventListener('click', this.handleLayerClick);
    anim.addEventListener('click', this.handleLayerClick);
    top1.addEventListener('click', this.handleLayerClick);
  }

  handleLayerClick = (event) => {
    const newLayer = event.target;
    const oldLayer = document.getElementById(this.activeLayer);

    event.stopPropagation();
    oldLayer.classList.remove('layer__button--active');
    newLayer.classList.add('layer__button--active');
    this.activeLayer = newLayer.id;
  };

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
  }

  render() {
    // Clear canvas hack
    // eslint-disable-next-line no-self-assign
    config.canvasAnim.width = config.canvasAnim.width;
  }
}

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    newMapForm.addEventListener('submit', (event) => {
      const mapSize = Number(size.value);
      const mapGround1 = new Array(mapSize)
        .fill(0)
        .map(() => new Array(mapSize).fill(1));
      const map = new Array(mapSize)
        .fill(0)
        .map(() => new Array(mapSize).fill(0));

      event.preventDefault();
      newMapForm.classList.add('new-map--hide');
      layer.classList.add('layer--show');

      // eslint-disable-next-line no-unused-vars
      const editor = new Editor({
        resources,
        map: {
          name: '',
          map: [mapGround1, map, map, map]
        }
      });
    });
  });
};
