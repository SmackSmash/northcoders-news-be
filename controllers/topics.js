const { readAllTopics } = require('../models/topics');

exports.getAllTopics = async (req, res) => {
  const topics = await readAllTopics();
  res.status(200).send({ topics });
};
