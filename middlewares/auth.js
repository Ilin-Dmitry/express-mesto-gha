const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const errModule = require('../errors/handleError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация!');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(errModule.handleError(err, res));
    throw new UnauthorizedError('Необходима авторизация!');
  }
  req.user = payload;
  return next();
};
