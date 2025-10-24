const db = require('../db/connection');

exports.deleteCommentById = async commentId => {
  await db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
  return;
};
