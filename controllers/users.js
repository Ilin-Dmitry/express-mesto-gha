const User = require('../models/user');
const errModule = require('../errors/handleError');
const NotFound = require('../errors/NotFound');

const errorMessages = {
  badRequestCreateUser: 'Переданы некорректные данные при создании пользователя',
  badRequestRefreshUser: 'Переданы некорректные данные при обновлении профиля',
  badRequestRefreshAvatar: 'Переданы некорректные данные при обновлении аватара',
  notFoundUser: 'Пользователь по указанному _id не найден',
  notFoundRefreshUser: ' Пользователь с указанным _id не найден',
};

module.exports.showAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errModule.handleError(err, res));
};

module.exports.showUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      errModule.handleError(err, res, {
        notFoundMessage: errorMessages.notFoundUser,
      });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => {
      console.log('user =>', user);
      return user;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestCreateUser,
    }));
};

module.exports.refreshUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestRefreshUser,
      notFoundMessage: errorMessages.notFoundRefreshUser,
    }));
};

module.exports.refreshUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestRefreshAvatar,
      notFoundMessage: errorMessages.notFoundRefreshUser,
    }));
};
