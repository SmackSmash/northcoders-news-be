const router = require('express').Router();
const { getAllArticles, getArticleById, getCommentsByArticleId, addComment } = require('../../controllers/articles');

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);
router.get('/:articleId/comments', getCommentsByArticleId);
router.post('/:articleId/comments', addComment);

module.exports = router;
