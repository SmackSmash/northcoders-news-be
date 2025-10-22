const db = require('../db/connection');

exports.readAllArticles = async () => {
  try {
    const response = await db.query(
      'SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC'
    );
    const topics = response.rows;
    return topics;
  } catch (error) {
    return error;
  }
};
