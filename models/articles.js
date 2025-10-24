const db = require('../db/connection');

exports.readAllArticles = async () => {
  const response = await db.query(
    `SELECT 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
  );
  const topics = response.rows;
  return topics;
};

exports.readArticleById = async articleId => {
  const response = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]);
  return response.rows[0];
};

exports.updateVotesByArticleById = async (articleId, votes) => {
  const response = await db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [
    votes,
    articleId
  ]);
  return response.rows[0];
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
