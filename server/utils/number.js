const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomId = () =>
  (Math.random().toString(36) + Math.random().toString(36)).replace(
    /[^a-z]+/g,
    ''
  );

exports.getRandomInt = getRandomInt;
exports.getRandomId = getRandomId;
