const format = require('pg-format');
const db = require('../db/connection');

exports.readAllArticles = async (sort_by = 'article_id', order = 'DESC', topic) => {
  const response = await db.query(
    format(
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
      ${topic ? `WHERE topic = '${topic}'` : ''}
      GROUP BY articles.article_id
      ORDER BY %I %s`,
      sort_by,
      order
    )
  );
  const articles = response.rows;

  return articles;
};

exports.readArticleById = async articleId => {
  const response = await db.query(
    `SELECT 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.body,
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
    CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
    [articleId]
  );

  return response.rows[0];
};

exports.updateVotesByArticleById = async (articleId, votes) => {
  const response = await db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [
    votes,
    articleId
  ]);

  return response.rows[0];
};
