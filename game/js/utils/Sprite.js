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
    // Stay not yet working correct
    if (!(this.stay && this.done)) {
      this.index += this.speed * delta;
      // Always start with first frame
      if (this.frames.length === 1) {
        this.index = 0;
      }
    }
  }

  render(ctx, resources) {
    let frame;

    if (this.speed > 0) {
      const max = this.frames.length,
        idx = Math.floor(this.index);

      frame = this.frames[idx % max];

      if (this.once && idx >= max) {
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
      ctx.drawImage(
        resources.get(this.url),
        x,
        y,
        this.size[0],
        this.size[1],
        0,
        0,
        this.size[0],
        this.size[1]
      );
    }
  }
}
