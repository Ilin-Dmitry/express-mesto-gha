const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

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
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
