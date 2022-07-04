const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const errModule = require('../errors/handleError');

module.exports = (req, res, next) => {
  const { _id } = req.cookies;
  if (!_id) {
    // return res.status(401).send({ message: 'Необходима авторизация!' });
    throw new UnauthorizedError('Необходима авторизация!');
  }
  const token = _id.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    next(errModule.handleError(err, res));
  }
  req.user = payload;
  return next();
};
