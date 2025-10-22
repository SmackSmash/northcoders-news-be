const db = require('../db/connection');

exports.readAllTopics = async () => {
  try {
    const response = await db.query('SELECT * FROM topics');
    const topics = response.rows;
    return topics;
  } catch (error) {
    return error;
  }
};
