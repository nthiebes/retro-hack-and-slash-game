import Canvas from '../canvas/Canvas.js';

const nextRaceBtn = document.getElementById('race-next');
const prevRaceBtn = document.getElementById('race-prev');
const character = document.getElementById('character');
const raceImg = document.getElementById('race-img');
const raceAttributes = document.getElementById('race-attributes');
const raceName = document.getElementById('race-name');
const map = document.getElementById('map');
const attributesMap = {
  strength: {
    good: 'Muskelbepackt',
    bad: 'Schwächlich',
    average: 3
  },
  dexterity: {
    good: 'Geschickt',
    bad: 'Tollpatschig',
    average: 3
  },
  intelligence: {
    good: 'Clever',
    bad: 'Einfach gestrickt',
    average: 3
  },
  defense: {
    good: 'Robust',
    bad: 'Zerbrechlich',
    average: 3
  },
  speed: {
    good: 'Rasant',
    bad: 'Träge',
    average: 4
  }
};

class Character {
  constructor({ gameData, resources }) {
    this.gameData = gameData;
    this.resources = resources;
    this.races = Object.entries(gameData.races);
    this.currentRace = 0;
    this.setRaceAttributes(this.races[0]);

    nextRaceBtn.addEventListener('click', this.handleNextRace);
    prevRaceBtn.addEventListener('click', this.handlePrevRace);
    character.addEventListener('submit', this.startGame);
  }

  handleNextRace = () => {
    raceImg.classList.remove(`race__img--${this.races[this.currentRace][0]}0`);

    if (!this.races[this.currentRace + 1]) {
      this.currentRace = -1;
    }

    const race = this.races[this.currentRace + 1];

    this.setRaceAttributes(race);
    raceImg.classList.add(`race__img--${race[0]}0`);
    this.currentRace++;
  };

  handlePrevRace = () => {
    raceImg.classList.remove(`race__img--${this.races[this.currentRace][0]}0`);

    if (!this.races[this.currentRace - 1]) {
      this.currentRace = this.races.length;
    }

    const race = this.races[this.currentRace - 1];

    this.setRaceAttributes(race);
    raceImg.classList.add(`race__img--${race[0]}0`);
    this.currentRace--;
  };

  setRaceAttributes = (race) => {
    const attributes = Object.entries(race[1]).filter(
      (attribute) => attribute[0] !== 'skins'
    );

    raceAttributes.innerHTML = '';
    raceName.innerHTML = race[0];

    attributes.forEach((attribute) => {
      const li = document.createElement('li');
      const attributeValue = attribute[1];
      const attributeData = attributesMap[attribute[0]];

      if (attributeValue > attributeData.average) {
        li.classList.add('attribute--good');
        li.append(attributeData.good);
        raceAttributes.append(li);
      }
    });

    attributes.forEach((attribute) => {
      const li = document.createElement('li');
      const attributeValue = attribute[1];
      const attributeData = attributesMap[attribute[0]];

      if (attributeValue < attributeData.average) {
        li.classList.add('attribute--bad');
        li.append(attributeData.bad);
        raceAttributes.append(li);
      }
    });
  };

  startGame = (event) => {
    event.preventDefault();

    const player = {
      id: 'player.0',
      friendly: true,
      name: 'Gscheid',
      race: null,
      skin: 0,
      health: 100,
      gear: {
        head: 'none',
        torso: 'none',
        leg: 'none'
      },
      weapons: {
        primary: 'fist',
        secondary: 'fist'
      }
    };

    fetch(`data/maps/${map.value}.json`)
      .then((response) => response.json())
      .then((json) => {
        this.gameData.map = json.map;
        this.gameData.items = json.items;
        this.gameData.players = json.players;
        this.gameData.enemies = json.enemies;
        this.gameData.mapItems = json.maps;

        // eslint-disable-next-line
        const game = new Canvas({
          ...this.gameData,
          resources: this.resources,
          player: {
            ...player,
            race: this.races[this.currentRace][0],
            pos: this.gameData.players[0]
          }
        });

        character.classList.add('character--hide');
      });
  };
}

export { Character };
