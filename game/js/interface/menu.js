import '../../../node_modules/socket.io-client/dist/socket.io.min.js';
import { Editor } from './editor.js';

const ENDPOINT =
  document.location.hostname === 'localhost'
    ? 'http://localhost:4001'
    : 'https://ridane.com';
const socket = io(ENDPOINT);
const newGame = document.getElementById('menu-new');
const map = document.getElementById('map');
const menuWindow = document.getElementById('menu');
const newWindow = document.getElementById('new');

export class Menu {
  static start({ gameData, resources }) {
    this.gameData = gameData;
    this.resources = resources;

    newGame.addEventListener('click', this.showMap);
    newWindow.addEventListener('submit', this.loadMap);

    // Connect player
    socket.emit('id', (myId) => {
      // console.log(myId);
    });
  }

  static showMap() {
    menuWindow.classList.remove('window--show');
    newWindow.classList.add('window--show');
  }

  static loadMap = (event) => {
    event.preventDefault();

    fetch(`/game/data/maps/${map.value}.json`)
      .then((response) => response.json())
      .then((json) => {
        this.gameData.map = json.map;
        this.gameData.items = json.items || [];
        this.gameData.players = json.players || [];
        this.gameData.enemies = json.enemies || [];
        this.gameData.mapItems = json.maps || [];
        this.gameData.animations = json.animations || [];

        Editor.start({
          gameData: this.gameData,
          resources: this.resources
        });
      });
  };
}
