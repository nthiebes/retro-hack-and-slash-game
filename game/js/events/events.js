import Sprite from '../utils/Sprite.js';
import Event from './Event.js';

let listData = [];

export class Events {
  static get list() {
    return listData;
  }

  static getEventById(id) {
    return listData.find((event) => event.id === id);
  }

  static getEventByPos({ x, y }) {
    return listData.find((event) => event.pos[0] === x && event.pos[1] === y);
  }

  static addEvents(events) {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      this.addEvent({
        pos: event.pos,
        type: event.type,
        id: event.id
      });
    }
  }

  static addEvent(event) {
    listData.push(
      new Event({
        ...event,
        sprite: new Sprite({
          url: `images/items/${event.id.split('.')[0]}.png`,
          pos: [0, 256],
          size: [256, 256],
          speed: 0,
          frames: [0]
        })
      })
    );
  }

  static updateEvents(events) {
    listData = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      this.addEvent({
        pos: event.pos,
        type: event.type,
        id: event.id
      });
    }
  }

  static removeEvent({ id }) {
    listData = listData.filter((event) => event.id !== id);
  }
}
