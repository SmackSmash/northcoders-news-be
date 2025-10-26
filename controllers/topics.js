const { readAllTopics } = require('../models/topics');

// @route   GET /api/topics
// @desc    Get all topics
exports.getAllTopics = async (req, res) => {
  const topics = await readAllTopics();

  res.status(200).send({ topics });
};
