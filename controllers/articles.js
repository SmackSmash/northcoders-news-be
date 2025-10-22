const { readAllArticles } = require('../models/articles');

exports.getAllArticles = async (req, res) => {
  const articles = await readAllArticles();
  res.status(200).send({ articles });
};
