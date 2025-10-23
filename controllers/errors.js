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

const errorHandler = (err, req, res, next) => {
  if (err.code) {
    switch (err.code) {
      case '23505':
        err = new AppError('Duplicate key', 409, req);
        break;
      case '23503':
        err = new AppError('Foreign key violation', 400, req);
        break;
      case '23502':
        err = new AppError('Missing required fields', 400, req);
        break;
      case '22P02':
        err = new AppError('Invalid input syntax', 400, req);
        break;
      case '42601':
        err = new AppError('Syntax error', 500, req);
        break;
      case '40001':
      case '40P01':
        err = new AppError('Temporary DB conflict, try again', 409, req);
        break;
      default:
        err = new AppError('DB error', 500, req);
    }
  }

  res.status(err.status || 500).send({
    error: err || 'Internal Server Error'
  });
};

module.exports = { AppError, notFoundHandler, errorHandler };
