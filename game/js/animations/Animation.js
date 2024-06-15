export default class Animation {
  constructor({ id, pos, autoplay, sprite, sound, chunk }) {
    this.frames = sprite.frames;
    this.sprite = sprite;
    this.sprite.frames = autoplay ? sprite.frames : [0];
    this.id = id;
    this.pos = pos;
    this.chunk = chunk;
    this.sound = sound;
  }

  play() {
    this.sprite.index = 0;
    this.sprite.frames = this.frames;
  }

  continue() {
    this.sprite.once = false;
    this.sprite.done = false;
  }

  stop() {
    this.sprite.once = true;
    this.sprite.done = true;
  }
}
