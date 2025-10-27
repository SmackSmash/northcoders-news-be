const { readAllArticles, readArticleById, updateVotesByArticleById } = require('../models/articles');
const { readAllTopics } = require('../models/topics');
const { AppError } = require('./errors');

// @route   GET /api/articles?sortby=*&order=*
// @desc    Get all articles
exports.getAllArticles = async (req, res) => {
  let { sort_by, order, topic } = req.query;
  if (!order || !['ASC', 'DESC'].includes(order.toUpperCase())) order = 'DESC';
  if (!sort_by || !['article_id', 'title', 'topic', 'author', 'created_at', 'votes'].includes(sort_by))
    sort_by = 'created_at';

  if (topic) {
    const topics = await readAllTopics();
    const validSlugs = topics.map(({ slug }) => slug);
    if (!validSlugs.includes(topic)) throw new AppError(`No topic exists with slug '${topic}'`, 404, req);
  }

  const articles = await readAllArticles(sort_by, order, topic);

  res.status(200).send({ articles });
};

// @route   GET /api/articles/:articleId
// @desc    Get article by articleId
exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;

  const article = await readArticleById(articleId);
  if (!article) throw new AppError(`No article exists with id ${articleId}`, 404, req);

  res.status(200).send({ article });
};

// @route   PATCH /api/articles/:articleId
// @desc    Increment article vote count
exports.addVotesByArticleId = async (req, res) => {
  const { articleId } = req.params;

  if (!req.body || !req.body.inc_votes) throw new AppError('Request body must have an "inc_votes" property', 400, req);
  const newVote = req.body.inc_votes;
  if (typeof newVote !== 'number') throw new AppError('Vote value must be a number', 400, req);

  const article = await updateVotesByArticleById(articleId, newVote);
  if (!article) throw new AppError(`No article exists with id ${articleId}`, 404, req);

  res.status(200).send({ article });
};
