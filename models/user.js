const mongoose = require('mongoose');

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

module.exports = mongoose.model('user', userSchema);
