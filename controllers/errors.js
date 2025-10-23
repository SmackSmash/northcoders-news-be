class AppError extends Error {
  constructor(message, status, error, req) {
    super(message);
    this.timestamp = new Date(Date.now());
    this.status = status;
    this.error = error;
    this.path = req.originalUrl;
  }
}

const notFoundHandler = (req, res) => {
  res.status(404).send({ message: 'Not Found' });
};

const errorHandler = (err, req, res, next) => {
  // TODO: Write logic for repackaging db errors in our nice AppError class
  // Seperation of concerns: seperate error hadnlers for different error types
  if (err.code === '22P02') {
    err = new AppError('Invalid text representation', 400, err.code, req);
  }
  const status = err.status || 500;
  res.status(status).send({
    error: err || 'Internal Server Error'
  });
};

module.exports = { AppError, notFoundHandler, errorHandler };
