const router = require('express').Router();

const { showAllCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/cards', showAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
