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
  if (err.code === '22P02') err = new AppError('Invalid text representation', 400, req);
  if (err.code === '42601') err = new AppError('Syntax error', 500, req);
  if (err.code === '23503') err = new AppError('Foreign key violation', 400, req);

  res.status(err.status || 500).send({
    error: err || 'Internal Server Error'
  });
};

module.exports = { AppError, notFoundHandler, errorHandler };
