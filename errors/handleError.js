const BadRequestError = require('./BadRequestError');
// const ConflictError = require('./ConflictError');
const InternalServerError = require('./InternalServerError');
const NotFoundError = require('./NotFoundError');
// const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
  handleError(err, res, { badRequestMessage = 'Переданы некорректные данные', notFoundMessage = 'Запрашиваемый объект не найден' }) {
    console.log('Начался полный handleError, err =>', err);

    // const ERROR_BAD_REQUEST = 400;
    // const ERROR_NOT_FOUND = 404;
    // const ERROR_DEFAULT = 500;
    if (err.message.includes('Illegal arguments')) {
      return new BadRequestError(badRequestMessage);
    }

    switch (err.name) {
      case 'ValidationError':
        // res.status(ERROR_BAD_REQUEST).send({ message: badRequestMessage });
        return new BadRequestError(badRequestMessage);
      case 'CastError':
        // res.status(ERROR_BAD_REQUEST).send({ message: badRequestMessage });
        // break;
        return new BadRequestError(badRequestMessage);

      case 'NotFoundError':
        // res.status(ERROR_NOT_FOUND).send({ message: notFoundMessage });
        // break;
        return new NotFoundError(notFoundMessage);
      default:
        // res.status(ERROR_DEFAULT).send({ message: 'ошибка по-умолчанию' });
        return new InternalServerError('ошибка по-умолчанию');
        // next(err)
    }
  },
};
