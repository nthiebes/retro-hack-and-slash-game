export default class Animation {
  constructor({ id, pos, autoplay, sprite }) {
    this.sprite = sprite;
    this.sprite.frames = autoplay ? sprite.frames : [0];
    this.id = id;
    this.autoplay = autoplay;
    this.pos = pos;
  }

  play() {
    this.sprite.index = 0;
  }
}
