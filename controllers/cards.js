const Card = require('../models/card');
const errModule = require('../errors/handleError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const errorMessages = {
  badRequestShowCards: 'Переданы некорректные данные при создании карточки',
  badRequestLike: 'Переданы некорректные данные для постановки/снятии лайка',
  notFoundCard: 'Карточка с указанным _id не найдена',
  notFoundLike: 'Передан несуществующий id карточки',
  forbidden: 'У вас недостаточно прав',
};

function checkCard(card, res) {
  if (!card) { throw new NotFoundError(errorMessages.notFoundCard); }
  res.send({ data: card });
}

module.exports.showAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(errModule.handleError(err, res)));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => next(errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestShowCards,
    })));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessages.notFoundCard);
      } else if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError(errorMessages.forbidden);
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((cardRes) => {
          checkCard(cardRes, res);
        });
    })
    .catch((err) => {
      next(errModule.handleError(err, res, {
        notFoundMessage: errorMessages.notFoundCard,
      }));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      checkCard(card, res);
    })
    .catch((err) => next(errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestLike,
      notFoundMessage: errorMessages.notFoundLike,
    })));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      checkCard(card, res);
    })
    .catch((err) => next(errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestLike,
      notFoundMessage: errorMessages.notFoundLike,
    })));
};
