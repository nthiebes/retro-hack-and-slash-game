import '../../../node_modules/socket.io-client/dist/socket.io.min.js';
import { Editor } from './editor.js';

const ENDPOINT =
  document.location.hostname === 'localhost'
    ? 'http://localhost:4001'
    : 'https://ridane.com';
const socket = io(ENDPOINT);
const mapField = document.getElementById('map');
const menuNew = document.getElementById('menu-new');
const menuJoin = document.getElementById('menu-join');
const menuWindow = document.getElementById('menu');
const newWindow = document.getElementById('new');

export class Menu {
  static start = (resources) => {
    this.resources = resources;
    this.id = null;

    menuNew.addEventListener('click', this.selectMap);
    menuJoin.addEventListener('click', this.joinGame);
    newWindow.addEventListener('submit', this.createGame);

    // Connect player
    socket.emit('id', (id) => {
      this.id = id;
    });
  };

  static selectMap() {
    menuWindow.classList.remove('window--show');
    newWindow.classList.add('window--show');
  }

  static joinGame = () => {
    socket.emit('game', ({ map }) => {
      if (map) {
        menuWindow.classList.remove('window--show');
        this.loadMap(map);
      } else {
        console.log('No game started');
      }
    });
  };

  static createGame = (event) => {
    event.preventDefault();

    socket.emit('new', {
      map: mapField.value
    });

    this.loadMap(mapField.value);
  };

  static loadMap = (map) => {
    fetch(`/game/data/maps/${map}.json`)
      .then((response) => response.json())
      .then((json) => {
        const gameData = {
          map: json.map,
          items: json.items || [],
          players: json.players || [],
          enemies: json.enemies || [],
          mapItems: json.maps || [],
          animations: json.animations || []
        };

        Editor.start({
          gameData,
          resources: this.resources
        });
      });
  };
}
