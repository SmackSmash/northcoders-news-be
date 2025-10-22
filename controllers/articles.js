const { readAllArticles, readArticleById } = require('../models/articles');

exports.getAllArticles = async (req, res) => {
  const articles = await readAllArticles();

  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;

  const article = await readArticleById(articleId);

  if (!article) {
    res.status(404).send({
      error: {
        timestamp: new Date(Date.now()),
        status: 404,
        error: 'Not Found',
        message: `No article exists with id ${articleId}`,
        path: req.originalUrl
      }
    });
  }

  res.status(200).send({ article });
};
