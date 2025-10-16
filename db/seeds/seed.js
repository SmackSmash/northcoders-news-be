const db = require('../connection');

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS topics;`).then(() => {
    return db.query(`CREATE TABLE topics (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        img_url VARCHAR(1000) NOT NULL
      );`);
  }); //<< write your first query in here.
};
module.exports = seed;
