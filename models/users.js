const db = require('../db/connection');

exports.readAllUsers = async () => {
  try {
    const response = await db.query('SELECT * FROM users');
    const users = response.rows;
    return users;
  } catch (error) {
    return error;
  }
};
