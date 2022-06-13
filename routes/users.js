const router = require('express').Router();

const { showAllUsers, showUser, createUser, sayHi } = require('../controllers/users');

router.get('/users', showAllUsers);

router.get('/users/:userId', showUser);

router.post('/users', createUser);

router.get('/hello', sayHi);

module.exports = router;
