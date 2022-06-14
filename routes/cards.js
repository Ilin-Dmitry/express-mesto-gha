const router = require('express').Router();

const { showAllCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);
router.get('/cards', showAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
