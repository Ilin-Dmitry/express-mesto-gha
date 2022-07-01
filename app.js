const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Теперь cookie доступны в объекте req.cookies:
// app.get('/posts', (req, res) => {
//   console.log(req.cookies.jwt); // достаём токен
// });

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62a6c442ecd67235fce1ea20',
// вставьте сюда _id созданного в предыдущем пункте пользователя
//   };
//   next();
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().domain(),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  const ERROR_NOT_FOUND = 404;
  Promise.reject(new Error('Путь не найден'))
    .catch(() => res.status(ERROR_NOT_FOUND).send({ message: 'Такого адреса не существует' }));
});

app.use(errors());

app.use((err, req, res) => {
  console.log('reached errHandler in app.js, err =>', err);
  // res.status(err.statusCode).send({ message: err.message });
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
