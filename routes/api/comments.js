const router = require('express').Router();
const { removeCommentById } = require('../../controllers/comments');

router.delete('/:commentId', removeCommentById);

module.exports = router;
