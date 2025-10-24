const { deleteCommentById } = require('../models/comments');
const { AppError } = require('./errors');

// @route   DELETE /api/comments/:commentId
// @desc    Delete comment by commentId
exports.removeCommentById = async (req, res) => {
  const { commentId } = req.params;

  const deletedRowCount = await deleteCommentById(commentId);

  if (deletedRowCount === 0) throw new AppError(`No comment found with id ${commentId}`, 404, req);

  res.status(204).send({ comment: 'Comment deleted successfully' });
};
