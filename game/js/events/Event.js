export default class Event {
  constructor({ id, pos, type, sprite, chunk }) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.chunk = chunk;
    this.sprite = sprite;
  }
}
