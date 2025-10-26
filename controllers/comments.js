const { deleteCommentById, readCommentsByArticleId, createComment } = require('../models/comments');
const { AppError } = require('./errors');

// @route   DELETE /api/comments/:commentId
// @desc    Delete comment by commentId
exports.removeCommentById = async (req, res) => {
  const { commentId } = req.params;

  const deletedRowCount = await deleteCommentById(commentId);
  if (deletedRowCount === 0) throw new AppError(`No comment found with id ${commentId}`, 404, req);

  res.status(204).send({ comment: 'Comment deleted successfully' });
};

// @route   GET /api/articles/:articleId/comments
// @desc    Get comments for article
exports.getCommentsByArticleId = async (req, res) => {
  const { articleId } = req.params;

  const comments = await readCommentsByArticleId(articleId);
  if (!comments.length) throw new AppError(`No comments exist for article with id ${articleId}`, 404, req);

  res.status(200).send({ comments });
};

// @route   POST /api/articles/:articleId/comments
// @desc    Add comment to article
exports.addComment = async (req, res) => {
  const { articleId } = req.params;
  const comment = req.body;
  if (!comment.username || !comment.body) throw new AppError(`Invalid comment data`, 400, req);

  const addedComment = await createComment(articleId, comment);
  if (!addedComment) throw new AppError(`Comment was not added`, 400, req);

  res.status(200).send({ comment: addedComment });
};
