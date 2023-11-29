export default class Event {
  constructor({ id, pos, type, sprite, removeBlocked }) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.sprite = sprite;
    this.removeBlocked = removeBlocked;
  }
}
