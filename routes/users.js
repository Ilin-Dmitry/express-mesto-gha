const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  showAllUsers, showUser, refreshUser, refreshUserAvatar, showMe,
} = require('../controllers/users');

router.get('/users/me', showMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), refreshUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/[a-z0-9-]+\.[\S]*/i),
  }),
}), refreshUserAvatar);
router.get('/users', showAllUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), showUser);

module.exports = router;
