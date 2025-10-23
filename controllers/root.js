exports.apiRoot = (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;

  res.status(200).send({
    topics: `${protocol}://${host}/api/topics`,
    articles: `${protocol}://${host}/api/articles`,
    users: `${protocol}://${host}/api/users`
  });
};
