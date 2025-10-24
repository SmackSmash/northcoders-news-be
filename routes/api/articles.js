const router = require('express').Router();
const { getAllArticles, getArticleById, incrementVotesByArticleId } = require('../../controllers/articles');
const { getCommentsByArticleId, addComment } = require('../../controllers/comments');

router.get('/', getAllArticles);

router.get('/:articleId', getArticleById);
router.patch('/:articleId', incrementVotesByArticleId);

router.get('/:articleId/comments', getCommentsByArticleId);
router.post('/:articleId/comments', addComment);

module.exports = router;
