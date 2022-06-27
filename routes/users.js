const router = require('express').Router();

const {
  showAllUsers, showUser, createUser, refreshUser, refreshUserAvatar, showMe,
} = require('../controllers/users');

router.get('/users/me', showMe);
router.patch('/users/me', refreshUser);
router.patch('/users/me/avatar', refreshUserAvatar);
router.get('/users', showAllUsers);
router.get('/users/:userId', showUser);
// router.post('/users', createUser);

module.exports = router;
