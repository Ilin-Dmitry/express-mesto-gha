const router = require('express').Router();

const {
  showAllUsers, showUser, createUser, refreshUser, refreshUserAvatar,
} = require('../controllers/users');

router.patch('/users/me', refreshUser);

router.patch('/users/me/avatar', refreshUserAvatar);

router.get('/users', showAllUsers);

router.get('/users/:userId', showUser);

router.post('/users', createUser);

module.exports = router;
