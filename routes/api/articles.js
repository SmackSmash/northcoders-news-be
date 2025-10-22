const router = require('express').Router();
const { getAllArticles } = require('../../controllers/articles');

router.get('/', getAllArticles);

module.exports = router;
