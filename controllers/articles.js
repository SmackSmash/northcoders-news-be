const { readAllArticles, readArticleById, readCommentsByArticleId, createComment } = require('../models/articles');
const { AppError } = require('./errors');

exports.getAllArticles = async (req, res) => {
  const articles = await readAllArticles();

  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;

  const article = await readArticleById(articleId);

  if (!article) throw new AppError(`No article exists with id ${articleId}`, 404, req);

  res.status(200).send({ article });
};

exports.getCommentsByArticleId = async (req, res) => {
  const { articleId } = req.params;

  const comments = await readCommentsByArticleId(articleId);

  if (!comments.length) throw new AppError(`No comments exist for article with id ${articleId}`, 404, req);

  res.status(200).send({ comments });
};

exports.addComment = async (req, res) => {
  const { articleId } = req.params;
  const comment = req.body;

  const addedComment = await createComment(articleId, comment);

  if (!addedComment) throw new AppError(`Comment was not added`, 400, req);

  res.status(200).send({ comment: addedComment });
};
