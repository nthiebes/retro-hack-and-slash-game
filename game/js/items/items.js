import Item from './Item.js';

let listData = [];

export class Items {
  static get list() {
    return listData;
  }

  static getItemById(id) {
    return listData.find((item) => item.id === id);
  }

  static getItemByPos({ x, y }) {
    return listData.find((item) => item.pos[0] === x && item.pos[1] === y);
  }

  static addItems(items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      this.addItem({
        pos: item.pos,
        id: item.id
      });
    }
  }

  static addItem(item) {
    listData.push(new Item(item));
  }

  static removeItem({ id }) {
    listData = listData.filter((item) => item.id !== id);
  }
}
