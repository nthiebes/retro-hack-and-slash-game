export default class Event {
  constructor({ id, pos, type, sprite }) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.sprite = sprite;
  }
}
