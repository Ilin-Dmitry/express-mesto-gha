const Card = require('../models/card');
const errModule = require('../errors/handleError');
const NotFoundError = require('../errors/NotFoundError');
// const BadRequestError = require('../errors/BadRequestError');
// const ConflictError = require('../errors/ConflictError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const errorMessages = {
  badRequestShowCards: 'Переданы некорректные данные при создании карточки',
  badRequestLike: 'Переданы некорректные данные для постановки/снятии лайка',
  notFoundDeleteCard: 'Карточка с указанным _id не найдена',
  notFoundLike: 'Передан несуществующий id карточки',
};

function checkCard(card, res) {
  if (!card) { throw new NotFoundError('Карточка не найдена'); }
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
    .then((card) => res.send({ data: card }))
    .catch((err) => next(errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestShowCards,
    })));
};

module.exports.deleteCard = (req, res, next) => {
  // console.log('req =>', req);
  console.log('req.user =>', req.user);
  console.log('req.params =>', req.params);
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log('card =>', card);
      console.log('req.user._id =>', req.user._id);
      console.log('рандомный консоль лог');
      // console.log('card.owner =>', card.owner);
      // console.log('card.owner =>', card.owner.toString());
      console.log('рандомный консоль лог 2');
      if (!card) {
        throw new NotFoundError('Такой карточки не найдено');
      } else if (req.user._id !== card.owner.toString()) {
        // return res.status(403).send({ message: 'У вас недостаточно прав' })
        throw new ForbiddenError('У вас недостаточно прав');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((cardRes) => {
          checkCard(cardRes, res);
        });
    })
    .catch((err) => {
      console.log('в catch пришел err =>', err);
      next(errModule.handleError(err, res, {
        notFoundMessage: errorMessages.notFoundDeleteCard,
      }));
    });
  // Card.findByIdAndRemove(req.params.cardId)
  //   .then((card) => {
  //     checkCard(card, res);
  //   })
  //   .catch((err) => errModule.handleError(err, res, {
  //     notFoundMessage: errorMessages.notFoundDeleteCard,
  //   }));
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
