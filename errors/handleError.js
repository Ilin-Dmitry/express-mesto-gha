module.exports = {
  handleError(err, res, { badRequestMessage = 'Переданы некорректные данные', notFoundMessage = 'Запрашиваемый объект не найден' }) {
    const ERROR_BAD_REQUEST = 400;
    const ERROR_NOT_FOUND = 404;
    const ERROR_DEFAULT = 500;

    switch (err.name) {
      case 'ValidationError':
        res.status(ERROR_BAD_REQUEST).send({ message: badRequestMessage });
        break;
      case 'CastError':
        res.status(ERROR_BAD_REQUEST).send({ message: badRequestMessage });
        break;
      case 'NotFoundError':
        res.status(ERROR_NOT_FOUND).send({ message: notFoundMessage });
        break;
      default:
        res.status(ERROR_DEFAULT).send({ message: 'ошибка по-умолчанию' });
    }
  },
};
