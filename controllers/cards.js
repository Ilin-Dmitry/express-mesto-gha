const Card = require('../models/card');

const handleError = (err, res) => {
  console.log('handleError запущен');
  const ERROR_BAD_REQUEST = 400;
  const ERROR_NOT_FOUND = 404;
  const ERROR_DEFAULT = 500;

  if (err.name === 'ValidationError') {
    res.status(ERROR_BAD_REQUEST).send({ "message": "переданы некорректные данные" });
    return;
  }
  if (err.name === 'CastError') {
    res.status(ERROR_NOT_FOUND).send({ "message": "карточка не найдена" });
    return;
  }
  res.status(ERROR_DEFAULT).send({ "message": "ошибка по-умолчанию" });
};

module.exports.showAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleError(err, res));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.likeCard = (req, res) => {
  console.log('req.params =>', req.params);
  // console.log('res =>', res);
  // console.log('req.params.cardId =>', req.params.cardId);
  // console.log('req.user._id =>', req.user._id);
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      console.log('card =>', card);
      return card;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id}}, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};
