import Canvas from '../canvas/Canvas.js';

const nextRace = document.getElementById('race-next');
const prevRace = document.getElementById('race-prev');
const editor = document.getElementById('editor');
const raceImg = document.getElementById('race-img');

class Editor {
  constructor({ gameData, resources }) {
    this.gameData = gameData;
    this.resources = resources;
    this.races = Object.keys(gameData.races);
    this.currentRace = 0;

    nextRace.addEventListener('click', this.handleNextRace);
    prevRace.addEventListener('click', this.handlePrevRace);
    editor.addEventListener('submit', this.startGame);
  }

  handleNextRace = () => {
    const currentRaceClass = `race__img--${this.races[this.currentRace]}0`;
    const nextRaceName = this.races[this.currentRace + 1];
    const nextRaceClass = `race__img--${nextRaceName}0`;

    if (nextRaceName) {
      raceImg.classList.replace(currentRaceClass, nextRaceClass);
      this.currentRace++;
    }
  };

  handlePrevRace = () => {
    const currentRaceClass = `race__img--${this.races[this.currentRace]}0`;
    const prevRaceName = this.races[this.currentRace - 1];
    const prevRaceClass = `race__img--${prevRaceName}0`;

    if (prevRaceName) {
      raceImg.classList.replace(currentRaceClass, prevRaceClass);
      this.currentRace--;
    }
  };

  startGame = (event) => {
    event.preventDefault();

    // eslint-disable-next-line
    const game = new Canvas({
      ...this.gameData,
      resources: this.resources,
      units: {
        ...this.gameData.units,
        player: {
          ...this.gameData.units.player,
          race: this.races[this.currentRace]
        }
      }
    });

    editor.classList.add('editor--hide');
  };
}

export { Editor };
