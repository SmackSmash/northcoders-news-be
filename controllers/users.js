const { readAllUsers } = require('../models/users');

// @route   GET /api/users
// @desc    Get all users
exports.getAllUsers = async (req, res) => {
  const users = await readAllUsers();
  res.status(200).send({ users });
};
