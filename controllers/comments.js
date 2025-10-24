const { deleteCommentById } = require('../models/comments');

// @route   DELETE /api/comments/:commentId
// @desc    Delete comment by commentId
exports.removeCommentById = async (req, res) => {
  const { commentId } = req.params;

  await deleteCommentById(commentId);

  res.status(204).send({ comment: 'Comment deleted successfully' });
};
