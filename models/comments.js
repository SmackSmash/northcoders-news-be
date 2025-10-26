const db = require('../db/connection');

exports.deleteCommentById = async commentId => {
  const response = await db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);

  return response.rowCount;
};

exports.readCommentsByArticleId = async articleId => {
  const response = await db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [articleId]);

  return response.rows;
};

exports.createComment = async (articleId, comment) => {
  const { username: author, body } = comment;
  const response = await db.query(`INSERT INTO comments(article_id, author, body) VALUES($1, $2, $3) RETURNING *`, [
    articleId,
    author,
    body
  ]);

  return response.rows[0];
};
