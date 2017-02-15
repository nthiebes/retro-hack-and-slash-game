import './main.scss';
import Resources from './js/utils/resources';
import Game from './js/game';
import 'whatwg-fetch';

class Ridane {
    constructor() {
        this.getResources();
    }

    getResources() {
        const resourcesList = [
            '/images/tileset.png',
            '/images/races/human0.png',
            '/images/races/human1.png',
            '/images/races/orc0.png',
            '/images/races/orc1.png'
        ];

        this.resources = new Resources();

        this.resources.load(resourcesList);

        this.resources.onReady(() => {
            this.getMap();
        });
    }

    getMap() {
        fetch('/data/maps/0.json')
        .then((response) => response.json()).then((json) => {
            this.map = json.map;
            this.getWeapons();
        });
    }

    getWeapons() {
        fetch('/data/armor.json')
        .then((response) => response.json()).then((json) => {
            this.weapons = json;
            this.getArmor();
        });
    }

    getArmor() {
        fetch('/data/armor.json')
        .then((response) => response.json()).then((json) => {
            this.armor = json;
            this.getRaces();
        });
    }

    getRaces() {
        fetch('/data/races.json')
        .then((response) => response.json()).then((json) => {
            this.races = json;
            this.getUnits();
        });
    }

    getUnits() {
        fetch('/data/units.json')
        .then((response) => response.json()).then((json) => {
            // eslint-disable-next-line
            const game = new Game({
                'map': this.map,
                'weapons': this.weapons,
                'armor': this.armor,
                'races': this.races,
                'units': json,
                'resources': this.resources
            });
        });
    }
}

window.onload = function() {
    // eslint-disable-next-line
    const ridane = new Ridane();
};
