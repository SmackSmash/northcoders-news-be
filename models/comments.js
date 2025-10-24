const db = require('../db/connection');

exports.deleteCommentById = async commentId => {
  const response = await db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
  return response.rowCount;
};
