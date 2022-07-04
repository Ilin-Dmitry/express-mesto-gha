const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const errModule = require('../errors/handleError');

module.exports = (req, res, next) => {
  const { _id } = req.cookies;
  if (!_id) {
    throw new UnauthorizedError('Необходима авторизация!');
  }
  let payload;
  try {
    payload = jwt.verify(_id, 'some-secret-key');
  } catch (err) {
    next(errModule.handleError(err, res));
  }
  req.user = payload;
  return next();
};
