const router = require('express').Router();

const { showAllUsers, showUser, createUser } = require('../controllers/users');

router.get('/users', showAllUsers);

router.get('/users/:userId', showUser);

router.post('/users', createUser);

module.exports = router;
