import './main.scss';
import Resources from './js/utils/resources';
import Canvas from './js/canvas';
import 'whatwg-fetch';

export default class Ridane {
    constructor() {
        this.getResources();
    }

    getResources() {
        const resources = new Resources(),
            resourcesList = [
                '/images/tileset.png',
                '/images/human0.png'
            ];

        resources.load(resourcesList);

        resources.onReady(() => {
            this.getMap(resources);
        });
    }

    getMap(resources) {
        fetch('/data/maps/0.json')
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            const canvas = new Canvas({
                'map': json.map,
                'resources': resources
            });
        });
    }
}

const ridane = new Ridane();
