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
  res.status(404).send({ message: 'Not Found' });
};

const errorHandler = (err, req, res, next) => {
  if (err.code === '22P02') err = new AppError('Invalid text representation', 400, req);
  if (err.code === '42601') err = new AppError('Syntax error', 500, req);

  res.status(err.status || 500).send({
    error: err || 'Internal Server Error'
  });
};

module.exports = { AppError, notFoundHandler, errorHandler };
