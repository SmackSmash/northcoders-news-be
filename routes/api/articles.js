const router = require('express').Router();
const { getAllArticles, getArticleById, getCommentsByArticleId } = require('../../controllers/articles');

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.get('/:articleId/comments', getCommentsByArticleId);

module.exports = router;
