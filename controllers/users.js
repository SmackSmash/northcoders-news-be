const { readAllUsers } = require('../models/users');

exports.getAllUsers = async (req, res) => {
  const users = await readAllUsers();
  res.status(200).send({ users });
};
