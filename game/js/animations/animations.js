import config from '../config.js';
import Sprite from '../utils/Sprite.js';
import Animation from './Animation.js';
import { GameData } from '../gameData.js';

const listData = [];

export class Animations {
  static get list() {
    return listData;
  }

  static addAnimations(animations) {
    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const animationData = GameData.getAnimation(animation.id);

      this.addAnimation({
        ...animationData,
        pos: animation.pos,
        id: `${animation.id}.${i}`
      });
    }
  }

  static addAnimation(animation) {
    listData.push(
      new Animation(
        {
          ...animation,
          sprite: new Sprite({
            url: 'images/animations.png',
            pos: animation.sprite.pos,
            size: animation.sprite.size,
            speed: animation.sprite.speed,
            frames: animation.sprite.frames
          })
        },
        config.debug
      )
    );
  }
}
