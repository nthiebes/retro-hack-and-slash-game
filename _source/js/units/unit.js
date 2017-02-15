export default class Unit { 
    constructor(config) {
        this.direction = 'RIGHT';
        this.moving = false;

        for (const i in config) {
            if (config.hasOwnProperty(i)) {
                this[i] = config[i];
            }
        }
    }

    walk() {
        switch (this.direction) {
            case 'LEFT':
                this.skin.pos = [0, 128];
                break;

            default:
                this.skin.pos = [0, 0];
        }

        this.skin.frames = [0, 1, 2, 3];
        this.moving = true;
    }

    stop() {
        this.moving = false;
        this.turn(this.direction);
        this.skin.frames = [0];
    }

    turn(direction) {
        switch (direction.toUpperCase()) {
            case 'LEFT':
                this.skin.pos = [0, 384];
                this.direction = 'LEFT';
                break;

            default:
                this.skin.pos = [0, 256];
                this.direction = 'RIGHT';
        }
    }
}
