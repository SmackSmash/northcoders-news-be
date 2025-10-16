const db = require('../connection');

const seed = ({ topicData, userData, articleData, commentData }) => {
  return (
    db
      // Maybe Promise.all()?
      .query(
        `DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS articles;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS topics;`
      )
      .then(() => {
        return db.query(`
          CREATE TABLE topics(
          slug VARCHAR(100) UNIQUE PRIMARY KEY,
          description VARCHAR(255) NOT NULL,
          img_url VARCHAR(1000) NOT NULL
        );`);
      })
      .then(() => {
        return db.query(`
          CREATE TABLE users(
          username VARCHAR(100) UNIQUE PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
        );`);
      })
      .then(() => {
        return db.query(`
          CREATE TABLE articles(
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          topic VARCHAR(100) NOT NULL,
          FOREIGN KEY (topic) REFERENCES topics(slug),
          author VARCHAR(100) NOT NULL,
          FOREIGN KEY (author) REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          votes INT NOT NULL DEFAULT 0,
          article_img_url VARCHAR(1000) NOT NULL
        );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          article_id INT NOT NULL,
          FOREIGN KEY (article_id) REFERENCES articles(article_id),
          body TEXT NOT NULL,
          votes INT NOT NULL DEFAULT 0,
          author VARCHAR(100) NOT NULL,
          FOREIGN KEY (author) REFERENCES users(username),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`);
      })
  );
};

module.exports = seed;
