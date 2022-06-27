const Card = require('../models/card');
const errModule = require('../errors/handleError');
const NotFound = require('../errors/NotFound');

const errorMessages = {
  badRequestShowCards: 'Переданы некорректные данные при создании карточки',
  badRequestLike: 'Переданы некорректные данные для постановки/снятии лайка',
  notFoundDeleteCard: 'Карточка с указанным _id не найдена',
  notFoundLike: 'Передан несуществующий id карточки',
};

function checkCard(card, res) {
  if (!card) { throw new NotFound('Карточка не найдена'); }
  res.send({ data: card });
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
  console.log('req =>', req);
  console.log('req.user =>', req.user);
  console.log('req.params =>', req.params);
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log('req.user._id =>', req.user._id);
      console.log('card.owner =>', card.owner.toString());
      if (req.user._id !== card.owner.toString()) {
        return res.status(403).send({ message: 'У вас недостаточно прав' })
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          checkCard(card, res);
        })
    })
    .catch((err) => errModule.handleError(err, res, {
      notFoundMessage: errorMessages.notFoundDeleteCard,
    }));
  // Card.findByIdAndRemove(req.params.cardId)
  //   .then((card) => {
  //     checkCard(card, res);
  //   })
  //   .catch((err) => errModule.handleError(err, res, {
  //     notFoundMessage: errorMessages.notFoundDeleteCard,
  //   }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      checkCard(card, res);
    })
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestLike,
      notFoundMessage: errorMessages.notFoundLike,
    }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      checkCard(card, res);
    })
    .catch((err) => errModule.handleError(err, res, {
      badRequestMessage: errorMessages.badRequestLike,
      notFoundMessage: errorMessages.notFoundLike,
    }));
};
