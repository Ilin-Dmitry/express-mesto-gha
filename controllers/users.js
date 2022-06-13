const User = require('../models/user');

module.exports.showAllUsers = (req, res) => {
  User.find({})
    .then(console.log('allUsers from showAllUsers'))
    .then(
      (users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.showUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  console.log('Создаем user');
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.sayHi = (req, res) => {
  res.send('Hello from controllers')
}

//{ data: user } - вместо hello в
//.then((user) => res.send({ data: user }))