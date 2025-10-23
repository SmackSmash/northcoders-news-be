const { readAllArticles, readArticleById } = require('../models/articles');
const { AppError } = require('./errors');

exports.getAllArticles = async (req, res) => {
  const articles = await readAllArticles();

  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;

  const article = await readArticleById(articleId);

  if (!article) {
    throw new AppError(`No article exists with id ${articleId}`, 404, req);
  }

  res.status(200).send({ article });
};

exports.getCommentsByArticleId = async (req, res) => {
  res.send('Here are your comments bro!');
};
