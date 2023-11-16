import config from '../config.js';

export default class Sprite {
  constructor(cfg) {
    this.pos = cfg.pos;
    this.size = cfg.size;
    this.speed = cfg.speed;
    this.frames = cfg.frames;
    this.index = 0;
    this.url = cfg.url;
    this.dir = cfg.dir || 'horizontal';
    this.once = cfg.once;
    this.stay = cfg.stay;
    this.inProgress = cfg.inProgress;
    this.currentframe = 0;
  }

  update(delta) {
    if (!(this.stay && this.done)) {
      this.index += this.speed * delta;

      // Always start with first frame
      if (this.frames.length === 1) {
        this.index = 0;
      }
    }
  }

  render(ctx, resources, direction) {
    let frame;

    if (this.speed > 0) {
      const max = this.frames.length,
        idx = Math.floor(this.index);

      frame = this.frames[idx % max];

      // Stop after running once
      if (this.once && idx >= max) {
        this.done = true;
      }

      // Stop at last frame
      if (this.stay && idx === max - 1 && max > 1) {
        this.done = true;
      }

      // End animation
      if (idx >= max) {
        this.index = 0;
      }
    } else {
      frame = 0;
    }

    this.currentframe = frame;

    let x = this.pos[0],
      y = this.pos[1];

    if (this.dir === 'vertical') {
      y += frame * this.size[1];
    } else {
      x += frame * this.size[0];
    }

    // If it is done and it has to run once, don't update
    if (!(this.done && this.once)) {
      ctx.save();
      //   ctx.imageSmoothingEnabled = false;

      if (direction === 'LEFT') {
        ctx.scale(-1, 1);
      }

      const dx = config.unitScale === 2 ? -64 : -32;
      const dy = config.unitScale === 2 ? -128 : -60;

      ctx.drawImage(
        resources.get(this.url),
        x,
        y,
        this.size[0],
        this.size[1],
        direction === 'LEFT' ? dx - this.size[0] + 128 : dx,
        dy,
        this.size[0] * config.unitScale,
        this.size[1] * config.unitScale
      );

      ctx.restore();
    }
  }
}
