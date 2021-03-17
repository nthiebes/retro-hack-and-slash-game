export default class Animation {
  constructor({ id, pos, autoplay, sprite }) {
    this.frames = sprite.frames;
    this.sprite = sprite;
    this.sprite.frames = autoplay ? sprite.frames : [0];
    this.id = id;
    this.pos = pos;
  }

  play() {
    this.sprite.index = 0;
    this.sprite.frames = this.frames;
  }
}
