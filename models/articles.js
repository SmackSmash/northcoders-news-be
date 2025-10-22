const db = require('../db/connection');

exports.readAllArticles = async () => {
  const response = await db.query(
    `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count
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
  const article = response.rows[0];
  return article;
};
