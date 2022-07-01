const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // console.log('req from auth =>', req);
  console.log('req.headers =>', req.headers);
  console.log('req.cookies =>', req.cookies);
  const { _id } = req.cookies;
  console.log('_id =>', _id);
  if (!_id) {
    console.log('_id почему-то здесь', _id);
    return res.status(401).send({ message: 'Необходима авторизация!' });
  }
  const token = _id.replace('Bearer ', '');
  console.log('token =>', token);
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    console.log('payload =>', payload);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  console.log('auth успешно, пошло дальше');
  req.user = payload;
  return next();
};
