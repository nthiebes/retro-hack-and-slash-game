import { Units } from '../units/units.js';
import { Menu } from './menu.js';
import { Inventory } from './inventory.js';
import { statsMap } from './translations.js';

const statisticsWindow = document.getElementById('statistics');
const statisticsList = document.getElementById('statistics-list');
const closeBtn = document.getElementById('close-statistics');

let statisticsOpen = false;

export class Statistics {
  static toggleStatistics() {
    if (statisticsOpen) {
      Statistics.hide();
      Menu.showBackground();
    } else {
      statisticsOpen = true;
      Statistics.updateStatistics();
      Menu.hideBackground();
      Inventory.hide();
      statisticsWindow.classList.add('window--show');
    }

    closeBtn.addEventListener('click', () => {
      Statistics.hide();
      Menu.showBackground();
    });
  }

  static hide() {
    statisticsOpen = false;
    statisticsWindow.classList.remove('window--show');
  }

  static updateStatistics() {
    statisticsList.innerHTML = '';

    Object.keys(Units.player.stats).forEach((key) => {
      const li = document.createElement('li');
      const value = document.createElement('span');

      value.className = 'inventory__stat';
      value.innerHTML = Units.player.stats[key];
      li.innerHTML = `${statsMap[key]}:`;
      li.appendChild(value);
      li.className = 'statistics__stat';
      statisticsList.append(li);
    });
  }
}
