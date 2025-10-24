const { AppError } = require('./errors');

exports.removeCommentById = (req, res) => {
  const { commentId } = req.params;
  console.log(commentId);
  res.send('Remove comment route');
};
