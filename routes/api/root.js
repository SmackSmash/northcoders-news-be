const router = require('express').Router();
const { apiRoot } = require('../../controllers/root');

router.get('/', apiRoot);

module.exports = router;
