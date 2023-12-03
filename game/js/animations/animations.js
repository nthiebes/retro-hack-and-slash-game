import config from '../config.js';
import Sprite from '../utils/Sprite.js';
import Animation from './Animation.js';
import { GameData } from '../gameData.js';

let listData = [];

export class Animations {
  static get list() {
    return listData;
  }

  static getAnimation({ x, y }) {
    return listData.find(
      (animation) => animation.pos[0] === x && animation.pos[1] === y
    );
  }

  static addAnimations(animations) {
    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const animationData = GameData.getAnimation(animation.id.split('.')[0]);

      this.addAnimation({
        ...animationData,
        pos: animation.pos,
        id: animation.id
      });
    }
  }

  static addAnimation(animation, played) {
    listData.push(
      new Animation(
        {
          ...animation,
          sprite: new Sprite({
            url: 'images/animations.png',
            pos: played ? [100, animation.sprite.pos[1]] : animation.sprite.pos,
            size: animation.sprite.size,
            speed: animation.sprite.speed,
            frames: animation.sprite.frames,
            once: animation.sprite.once,
            stay: animation.sprite.stay
          })
        },
        config.debug
      )
    );
  }

  static updateAnimations(animations) {
    listData = [];

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const animationData = GameData.getAnimation(animation.id.split('.')[0]);

      this.addAnimation(
        {
          ...animationData,
          pos: animation.pos,
          id: animation.id
        },
        animation.played
      );
    }
  }
}
