export default class Animation {
  constructor({ id, mapPos, frames, autoplay, sprite }) {
    this.sprite = sprite;
    this.sprite.frames = autoplay ? frames : [0];
    this.id = id;
    this.autoplay = autoplay;
    this.pos = mapPos;
  }

  play() {
    this.sprite.index = 0;
  }
}
