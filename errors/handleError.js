module.exports = {
  handleError(err, res, { badRequestMessage = 'Переданы некорректные данные', notFoundMessage = 'Запрашиваемый объект не найден' }) {
    const ERROR_BAD_REQUEST = 400;
    const ERROR_NOT_FOUND = 404;
    const ERROR_DEFAULT = 500;

    if (err.name === 'ValidationError') {
      res.status(ERROR_BAD_REQUEST).send({ message: badRequestMessage });
      return;
    }
    if (err.name === 'BadRequestError') {
      res.status(ERROR_NOT_FOUND ).send({ message: notFoundMessage });
      return;
    }
    if (err.name === 'CastError') {
      res.status(ERROR_NOT_FOUND).send({ message: notFoundMessage });
      return;
    }
    res.status(ERROR_DEFAULT).send({ message: 'ошибка по-умолчанию' });
  },
};
