const Card = require('../models/card');
const errModule = require('../errors/handleError');

const errorMessages = {
  badRequestShowCards: 'Переданы некорректные данные при создании карточки',
  badRequestLike: 'Переданы некорректные данные для постановки/снятии лайка',
  notFoundDeleteCard: 'Карточка с указанным _id не найдена',
  notFoundLike: 'Передан несуществующий id карточки',
};

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports.showAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => errModule.handleError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestShowCards,
    }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) { throw new NotFound('Карточка не найдена'); }
      res.send({ data: card });
    })
    .catch((err) => errModule.handleError(err, res, {
      notFoundMessage: errorMessages.notFoundDeleteCard,
    }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      console.log('req.params.cardId =>', req.params.cardId);
      console.log('card => ', card);
      return card;
    })
    .then((card) => {
      if (!card) { throw new NotFound('Карточка не найдена'); }
      res.send({ data: card });
    })
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestLike,
      notFoundMessage: errorMessages.notFoundLike,
    }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) { throw new NotFound('Карточка не найдена'); }
      res.send({ data: card });
    })
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestLike,
      notFoundMessage: errorMessages.notFoundLike,
    }));
};
