const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError')

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     default: 'Жак-Ив Кусто',
//     minLength: 2,
//     maxlength: 30,
//   },
//   avatar: {
//     type: String,
//     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//   },
//   about: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: 'Исследователь',
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Неверный email');
//       }
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /https?:\/\/[a-z0-9-]+\.[\S]*/gi.test(v);
      },
      message: props => `${props.value} is not a valid avatar url!`,
    },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      console.log('user from findUserByCredentials =>', user);
      // console.log('user from findUserByCredentials =>', user.select('+password'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
      // .catch((err) => {
      //   console.log('err catched in findUserBy... err=>', err, err.name, err.message),
      // });
    })
    .catch((err) => {
      console.log('one more err =>', err);
    })
};

module.exports = mongoose.model('user', userSchema);
