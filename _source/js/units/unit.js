export default class Unit { 
    constructor(config, debug) {
        this.direction = 'RIGHT';
        this.moving = false;
        this.attacking = false;
        this.path = [];
        this.debug = debug;

        for (const i in config) {
            if (config.hasOwnProperty(i)) {
                this[i] = config[i];
            }
        }
    }

    walk() {
        if (this.debug) {
            console.log('=> walk');
        }

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

    attack() {
        if (this.debug) {
            console.log('=> attack');
        }

        switch (this.direction) {
            case 'LEFT':
                this.skin.pos = [0, 384];
                break;

            default:
                this.skin.pos = [0, 256];
        }

        this.skin.frames = [0, 1, 2];
        this.skin.index = 0;
        this.moving = false;
        this.attacking = true;
    }

    stop() {
        if (this.debug) {
            console.log('=> stop');
        }

        this.moving = false;
        this.attacking = false;
        this.skin.once = false;
        this.skin.done = false;
        this.turn(this.direction);
        this.skin.frames = [0];
    }

    turn(direction) {
        if (this.debug) {
            console.log('=> turn ' + direction);
        }

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
