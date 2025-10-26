const db = require('../db/connection');

exports.readAllTopics = async () => {
  const response = await db.query('SELECT * FROM topics');

  return response.rows;
};
