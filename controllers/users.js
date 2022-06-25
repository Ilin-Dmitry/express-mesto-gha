const bcrypt = require('bcryptjs');
const validator = require('validator');
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

// module.exports.createUser = (req, res) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   bcrypt.hash(password, 10)
//     .then((hash) => {
//       User.create({
//         name, about, avatar, email, password: hash,
//       })
//         .then((user) => res.send({ data: user }));
//     })
//     .catch((err) => errModule.handleError(err, res, {
//       badRequestMessage: errorMessages.badRequestCreateUser,
//     }));
// };

const emailValidation = (email) => {
  if (!validator.isEmail(email)) {
    return Promise.reject(new Error('bad email'))
  }

};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // validator.isEmail(email)
    // .catch((err) => res.send('Ошибка в email'))
  // try {
  //   emailValidation(email);
  // }
  // catch (err) {
  //   errModule.handleError(err, res, {
  //     badRequestMessage: errorMessages.badRequestCreateUser,
  //   })
  // }

  if (!validator.isEmail(email)) {
    return res.status(444).send({ message: 'Введен email с ошибкой' });
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, about, avatar, email, password: hash,
          })
            .then((user) => res.send({ data: user }));
        })
        .catch((err) => errModule.handleError(err, res, {
          badRequestMessage: errorMessages.badRequestCreateUser,
        }));
    });
};


// module.exports.createUser = (req, res) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   // if (!validator.isEmail(email)) {
//   //   throw new Error('Неверный email');
//   // }
//   validator.isEmail(email)
//     .then(() => {bcrypt.hash(password, 10)})
//     .then((hash) => {
//       User.create({
//         name, about, avatar, email, password: hash,
//       })
//         .then((user) => res.send({ data: user }));
//     })
//     .catch((err) => errModule.handleError(err, res, {
//       badRequestMessage: errorMessages.badRequestCreateUser,
//     }));
// };

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
