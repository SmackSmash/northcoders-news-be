const router = require('express').Router();
const { getAllArticles, getArticleById } = require('../../controllers/articles');

router.get('/', getAllArticles);
router.get('/:articleId', getArticleById);

module.exports = router;
