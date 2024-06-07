import Canvas from '../canvas/Canvas.js';
import { GameData } from '../gameData.js';
import { socket } from '../utils/socket.js';
import { sounds } from '../utils/sounds.js';
import { attributesMap, racesMap } from './translations.js';

const mapField = document.getElementById('map');
const fullscreen = document.getElementById('fullscreen');
const nameField = document.getElementById('name');
const menuNew = document.getElementById('menu-new');
const menuJoin = document.getElementById('menu-join');
const menuWindow = document.getElementById('menu');
const newWindow = document.getElementById('new');
const nextRaceBtn = document.getElementById('race-next');
const prevRaceBtn = document.getElementById('race-prev');
const nextSkinBtn = document.getElementById('skin-next');
const prevSkinBtn = document.getElementById('skin-prev');
const nextHairBtn = document.getElementById('hair-next');
const prevHairBtn = document.getElementById('hair-prev');
const nextFaceBtn = document.getElementById('face-next');
const prevFaceBtn = document.getElementById('face-prev');
const characterWindow = document.getElementById('character');
const raceImg = document.getElementById('race-preview');
const faceImg = document.getElementById('face-preview');
const hairImg = document.getElementById('hair-preview');
const raceCounter = document.getElementById('race-count');
const skinCounter = document.getElementById('skin-count');
const hairCounter = document.getElementById('hair-count');
const faceCounter = document.getElementById('face-count');
const raceAttributes = document.getElementById('race-attributes');
const raceName = document.getElementById('race-name');
const minimap = document.getElementById('minimap');
const healthBar = document.getElementById('health-bar');
const healthBarNumber = document.getElementById('health-bar-number');
const canvasWrapper = document.getElementById('canvas-wrapper');
const menuButton = document.getElementById('menu-button');
const ingameMenu = document.getElementById('ingame-menu');
const menuContinue = document.getElementById('menu-continue');
const menuLeave = document.getElementById('menu-leave');
let ingameMenuOpen = false;

export class Menu {
  static start = (resources) => {
    Menu.resources = resources;
    Menu.races = Object.entries(GameData.races).filter(
      (race) => race[0] !== 'zombie'
    );
    Menu.currentRace = 0;
    Menu.player = {
      id: null,
      friendly: true,
      name: nameField.value,
      direction: 'RIGHT',
      health: 1000,
      sex: 'male',
      gear: {
        head: 'none',
        torso: 'none',
        leg: 'none'
      },
      weapons: {
        primary: 'none',
        secondary: 'none'
      }
    };

    menuNew.addEventListener('click', Menu.selectMap);
    menuJoin.addEventListener('click', Menu.showCharacterEditor);
    newWindow.addEventListener('submit', Menu.createGame);
    fullscreen.addEventListener('click', Menu.toggleFullScreen);
    menuButton.addEventListener('click', Menu.toggleIngameMenu);
    menuContinue.addEventListener('click', Menu.toggleIngameMenu);
    menuLeave.addEventListener('click', () => {
      window.location.reload();
    });

    // Connect player
    socket.emit('id', ({ playerId, gameId }) => {
      Menu.player.id = playerId;

      if (gameId) {
        menuJoin.removeAttribute('disabled');
      } else {
        menuNew.removeAttribute('disabled');
      }
    });

    // Server disconnects
    socket.on('disconnect', () => {
      window.location.reload();
    });

    // Game closed
    socket.on('game-over', () => {
      menuJoin.setAttribute('disabled', true);
      menuNew.removeAttribute('disabled');
    });

    // Game started
    socket.on('game-started', () => {
      menuJoin.removeAttribute('disabled');
      menuNew.setAttribute('disabled', true);
    });
  };

  static toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    sounds.effects.play('click');
  }

  static toggleIngameMenu() {
    if (ingameMenuOpen) {
      ingameMenu.classList.remove('window--show');
      sounds.effects.play('click');
      Menu.showBackground();
      ingameMenuOpen = false;
    } else {
      ingameMenu.classList.toggle('window--show');
      sounds.effects.play('click');
      Menu.hideBackground();
      ingameMenuOpen = true;
    }
  }

  static hideBackground() {
    canvasWrapper.classList.add('window--focussed');
    minimap.classList.add('window--focussed');
    healthBar.classList.add('window--focussed');
  }

  static showBackground() {
    canvasWrapper.classList.remove('window--focussed');
    minimap.classList.remove('window--focussed');
    healthBar.classList.remove('window--focussed');
  }

  static selectMap() {
    menuWindow.classList.remove('window--show');
    newWindow.classList.add('window--show');

    sounds.effects.play('click');
  }

  static createGame = (event) => {
    event.preventDefault();

    sounds.effects.play('click');

    socket.emit('new-game', {
      mapId: mapField.value
    });

    newWindow.classList.add('window--show');

    Menu.showCharacterEditor();
  };

  static showCharacterEditor() {
    Menu.setRaceAttributes(Menu.races[0]);

    sounds.effects.play('click');

    nextRaceBtn.addEventListener('click', Menu.handleNextRace);
    prevRaceBtn.addEventListener('click', Menu.handlePrevRace);
    nextSkinBtn.addEventListener('click', Menu.handleNextSkin);
    prevSkinBtn.addEventListener('click', Menu.handlePrevSkin);
    nextHairBtn.addEventListener('click', Menu.handleNextHair);
    prevHairBtn.addEventListener('click', Menu.handlePrevHair);
    nextFaceBtn.addEventListener('click', Menu.handleNextFace);
    prevFaceBtn.addEventListener('click', Menu.handlePrevFace);
    characterWindow.addEventListener('submit', Menu.joinGame);

    newWindow.classList.remove('window--show');
    characterWindow.classList.add('window--show');

    raceCounter.innerHTML = `1 / ${Menu.races.length}`;
    Menu.resetCounters();
  }

  static resetCounters = () => {
    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;
    const hairCount = GameData.races[race].hair;
    const faceCount = GameData.races[race].faces;

    skinCounter.innerHTML = `1 / ${skinCount}`;
    faceCounter.innerHTML = `1 / ${faceCount}`;
    hairCounter.innerHTML = `1 / ${hairCount}`;

    Menu.currentSkin = 0;
    Menu.currentFace = 0;
    Menu.currentHair = 0;

    raceImg.style.backgroundImage = `url(/game/images/races/${race}${Menu.currentSkin}.png)`;
    faceImg.style.backgroundImage = `url(/game/images/faces/${race}/face${Menu.currentFace}.png)`;
    hairImg.style.backgroundImage = `url(/game/images/hair/${race}/hair${Menu.currentHair}.png)`;
  };

  static handleNextRace = () => {
    if (!Menu.races[Menu.currentRace + 1]) {
      Menu.currentRace = -1;
    }

    sounds.effects.play('click');

    const race = Menu.races[Menu.currentRace + 1];

    raceCounter.innerHTML = `${Menu.currentRace + 2} / ${Menu.races.length}`;
    Menu.setRaceAttributes(race);
    raceImg.style.backgroundImage = `url(/game/images/races/${race[0]}0.png)`;
    Menu.currentRace++;
    Menu.resetCounters();
  };

  static handlePrevRace = () => {
    if (!Menu.races[Menu.currentRace - 1]) {
      Menu.currentRace = Menu.races.length;
    }

    sounds.effects.play('click');

    const race = Menu.races[Menu.currentRace - 1];

    raceCounter.innerHTML = `${Menu.currentRace} / ${Menu.races.length}`;
    Menu.setRaceAttributes(race);
    raceImg.style.backgroundImage = `url(/game/images/races/${race[0]}0.png)`;
    Menu.currentRace--;
    Menu.resetCounters();
  };

  static handleNextSkin = () => {
    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;

    if (Menu.currentSkin === skinCount - 1) {
      Menu.currentSkin = -1;
    }

    sounds.effects.play('click');

    Menu.currentSkin++;
    skinCounter.innerHTML = `${Menu.currentSkin + 1} / ${skinCount}`;
    raceImg.style.backgroundImage = `url(/game/images/races/${race}${Menu.currentSkin}.png)`;
  };

  static handlePrevSkin = () => {
    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;

    if (Menu.currentSkin === 0) {
      Menu.currentSkin = skinCount;
    }

    sounds.effects.play('click');

    Menu.currentSkin--;
    skinCounter.innerHTML = `${Menu.currentSkin + 1} / ${skinCount}`;
    raceImg.style.backgroundImage = `url(/game/images/races/${race}${Menu.currentSkin}.png)`;
  };

  static handleNextFace = () => {
    const race = Menu.races[Menu.currentRace][0];
    const faceCount = GameData.races[race].faces;

    if (Menu.currentFace === faceCount - 1) {
      Menu.currentFace = -1;
    }

    sounds.effects.play('click');

    Menu.currentFace++;
    faceCounter.innerHTML = `${Menu.currentFace + 1} / ${faceCount}`;
    faceImg.style.backgroundImage = `url(/game/images/faces/${race}/face${Menu.currentFace}.png)`;
  };

  static handlePrevFace = () => {
    const race = Menu.races[Menu.currentRace][0];
    const faceCount = GameData.races[race].faces;

    if (Menu.currentFace === 0) {
      Menu.currentFace = faceCount;
    }

    sounds.effects.play('click');

    Menu.currentFace--;
    faceCounter.innerHTML = `${Menu.currentFace + 1} / ${faceCount}`;
    faceImg.style.backgroundImage = `url(/game/images/faces/${race}/face${Menu.currentFace}.png)`;
  };

  static handleNextHair = () => {
    const race = Menu.races[Menu.currentRace][0];
    const hairCount = GameData.races[race].hair;

    if (Menu.currentHair === hairCount - 1) {
      Menu.currentHair = -1;
    }

    sounds.effects.play('click');

    Menu.currentHair++;
    hairCounter.innerHTML = `${Menu.currentHair + 1} / ${hairCount}`;
    hairImg.style.backgroundImage = `url(/game/images/hair/${race}/hair${Menu.currentHair}.png)`;
  };

  static handlePrevHair = () => {
    const race = Menu.races[Menu.currentRace][0];
    const hairCount = GameData.races[race].hair;

    if (Menu.currentHair === 0) {
      Menu.currentHair = hairCount;
    }

    sounds.effects.play('click');

    Menu.currentHair--;
    hairCounter.innerHTML = `${Menu.currentHair + 1} / ${hairCount}`;
    hairImg.style.backgroundImage = `url(/game/images/hair/${race}/hair${Menu.currentHair}.png)`;
  };

  static setRaceAttributes = (race) => {
    const attributes = Object.entries(race[1]).filter(
      (attribute) =>
        attribute[0] !== 'skins' &&
        attribute[0] !== 'faces' &&
        attribute[0] !== 'hair'
    );

    raceAttributes.innerHTML = '';
    raceName.innerHTML = racesMap[race[0]];
    attributes.forEach((attribute) => {
      const li = document.createElement('li');
      const attributeValue = attribute[1];
      const attributeData = attributesMap[attribute[0]];

      if (attributeValue > attributeData.average + 1) {
        li.classList.add('attribute--good');
        li.append(attributeData.best);
        raceAttributes.append(li);
      } else if (attributeValue > attributeData.average) {
        li.classList.add('attribute--good');
        li.append(attributeData.good);
        raceAttributes.append(li);
      } else if (attributeValue < attributeData.average) {
        li.classList.add('attribute--bad');
        li.append(attributeData.bad);
        raceAttributes.append(li);
      }
    });
  };

  static joinGame = (event) => {
    event.preventDefault();

    sounds.effects.play('start');

    const race = Menu.races[Menu.currentRace][0];
    Menu.player = {
      ...Menu.player,
      race,
      skin: Menu.currentSkin,
      cosmetics: {
        face: `face${Menu.currentFace}`,
        hair: `hair${Menu.currentHair}`
      }
    };

    socket.emit(
      'join-game',
      {
        player: Menu.player
      },
      ({ map, events, players, enemies, mapTransitions, animations }) => {
        // eslint-disable-next-line
        const game = new Canvas({
          map,
          events,
          players,
          enemies,
          mapEvents: mapTransitions,
          animations,
          resources: Menu.resources,
          player: {
            ...Menu.player,
            pos: players.find(({ id }) => Menu.player.id === id).pos
          }
        });

        menuWindow.classList.remove('window--show');
        characterWindow.classList.remove('window--show');
        minimap.classList.add('minimap--show');
        healthBar.classList.add('health-bar--show');
        menuButton.removeAttribute('disabled');
        healthBarNumber.innerHTML = `${Menu.player.health} / ${Menu.player.health}`;
      }
    );
  };
}

//   static loadMap = () => {
//     fetch(`/game/data/maps/${Menu.mapId}.json`)
//       .then((response) => response.json())
//       .then((json) => {
//         const gameData = {
//           map: json.map,
//           events: json.events || [],
//           players: json.players || [],
//           enemies: json.enemies || [],
//           mapEvents: json.maps || [],
//           animations: json.animations || []
//         };
//       });
//   };
