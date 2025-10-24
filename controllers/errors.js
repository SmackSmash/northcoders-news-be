class AppError extends Error {
  constructor(message, status, req) {
    super(message);
    this.timestamp = new Date(Date.now());
    this.status = status;
    this.errorMessage = message;
    this.path = req.originalUrl;
  }
}

const notFoundHandler = (req, res) => {
  res.status(404).send({ error: new AppError('Not found', 404, req) });
};

const dbErrorHandler = (err, req, res, next) => {
  if (!err.code) next(err);

  switch (err.code) {
    case '23505':
      return res.status(409).send({ error: new AppError('Duplicate key', 409, req) });
    case '23503':
      return res.status(400).send({ error: new AppError('Foreign key violation', 400, req) });
    case '23502':
      return res.status(400).send({ error: new AppError('Missing required fields', 400, req) });
    case '22P02':
      return res.status(400).send({ error: new AppError('Invalid input syntax', 400, req) });
    case '42601':
      return res.status(500).send({ error: new AppError('Syntax error', 500, req) });
    case '40001':
    case '40P01':
      return res.status(409).send({ error: new AppError('Temporary DB conflict, try again', 409, req) });
    default:
      res.status(500).send({ error: new AppError('DB error', 500, req) });
  }
};

const appErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500).send({
    error: err || 'Internal Server Error'
  });
};

module.exports = { AppError, notFoundHandler, dbErrorHandler, appErrorHandler };
