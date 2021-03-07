import config from '../config.js';
import { getCircle, uniq } from './utils.js';

export const getFieldsInSight = (pos, range = config.visibility) => {
  const posX = Math.floor(pos[0]);
  const posY = Math.floor(pos[1]);
  const newFields = [];
  let fieldsInSight = [];

  // Collect circle tiles for each range
  for (let l = 1; l <= range; l++) {
    fieldsInSight = fieldsInSight.concat(getCircle(posX, posY, l));
  }

  // Remove tiles that are out of the map
  fieldsInSight = fieldsInSight.filter(
    (field) => field[0] >= 0 && field[1] >= 0
  );

  // Fill gaps
  for (let i = 0; i < fieldsInSight.length; i++) {
    const y = fieldsInSight[i][0],
      x = fieldsInSight[i][1];

    if (x > posY) {
      newFields.push([y, x - 1]);
    }

    if (x < posY) {
      newFields.push([y, x + 1]);
    }
  }

  // Merge the new array
  fieldsInSight = fieldsInSight.concat(newFields);

  // Remove duplicates
  fieldsInSight = uniq(fieldsInSight);

  return fieldsInSight;
};
