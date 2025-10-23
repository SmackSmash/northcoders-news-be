const db = require('../db/connection');

exports.readAllUsers = async () => {
  const response = await db.query('SELECT * FROM users');
  return response.rows;
};

exports.readUserByUsername = async username => {
  const response = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return response.rows[0];
};
