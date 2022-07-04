const BadRequestError = require('./BadRequestError');
const ForbiddenError = require('./ForbiddenError');
const InternalServerError = require('./InternalServerError');
const NotFoundError = require('./NotFoundError');

module.exports = {
  handleError(err, res, { badRequestMessage = 'Переданы некорректные данные', notFoundMessage = 'Запрашиваемый объект не найден' }) {
    if (err.message.includes('Illegal arguments')) {
      return new BadRequestError(badRequestMessage);
    }
    switch (err.name) {
      case 'ValidationError':
        return new BadRequestError(badRequestMessage);
      case 'CastError':
        return new BadRequestError(badRequestMessage);
      case 'NotFoundError':
        return new NotFoundError(notFoundMessage);
      case 'ForbiddenError':
        return new ForbiddenError('У вас недостаточно прав');
      default:
        return new InternalServerError('ошибка по-умолчанию');
    }
  },
};
