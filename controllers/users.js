const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errModule = require('../errors/handleError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const errorMessages = {
  badRequestCreateUser: 'Переданы некорректные данные при создании пользователя',
  badRequestRefreshUser: 'Переданы некорректные данные при обновлении профиля',
  badRequestRefreshAvatar: 'Переданы некорректные данные при обновлении аватара',
  notFoundUser: 'Пользователь по указанному _id не найден',
  notFoundRefreshUser: ' Пользователь с указанным _id не найден',
};

module.exports.showAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(errModule.handleError(err, res)));
};

module.exports.showUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      next(errModule.handleError(err, res, {
        notFoundMessage: errorMessages.notFoundUser,
      }));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash,
          })
            .then((userData) => {
              res.status(201).send({
                data: {
                  name: userData.name,
                  avatar: userData.avatar,
                  about: userData.about,
                  email: userData.email,
                  _id: userData._id,
                },
              });
            });
        })
        .catch((err) => {
          next(errModule.handleError(err, res, {
            badRequestMessage: errorMessages.badRequestCreateUser,
          }));
        });
    });
};

module.exports.refreshUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestRefreshUser,
      notFoundMessage: errorMessages.notFoundRefreshUser,
    })));
};

module.exports.refreshUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestRefreshAvatar,
      notFoundMessage: errorMessages.notFoundRefreshUser,
    })));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({
        data: {
          name: user.name,
          avatar: user.avatar,
          about: user.about,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch(next);
};

module.exports.showMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      next(
        errModule.handleError(err, res, {
          notFoundMessage: errorMessages.notFoundUser,
        }),
      );
    });
};
