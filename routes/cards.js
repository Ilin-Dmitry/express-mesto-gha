const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  showAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);
router.get('/cards', showAllCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/[a-z0-9-]+\.[\S]*/i),
  }),
}), createCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
