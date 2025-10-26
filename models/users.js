const db = require('../db/connection');

exports.readAllUsers = async () => {
  const response = await db.query('SELECT * FROM users');

  return response.rows;
};
