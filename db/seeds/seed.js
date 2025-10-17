const format = require('pg-format');
const db = require('../connection');
const { formatDataForSQL, createLookupObj } = require('./utils');

const seed = ({ topicData, userData, articleData, commentData, emojiData, emojiArticleUserData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS emoji_article_users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return Promise.all([
        db.query(`DROP TABLE IF EXISTS users;`),
        db.query(`DROP TABLE IF EXISTS topics;`),
        db.query(`DROP TABLE IF EXISTS emojis;`)
      ]);
    })
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
    .then(() => {
      return db.query(`CREATE TABLE emojis(
        emoji_id SERIAL PRIMARY KEY,
        emoji CHAR NOT NULL
        )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE emoji_article_users(
        emoji_article_user_id SERIAL PRIMARY KEY,
        emoji_id INT NOT NULL,
        FOREIGN KEY (emoji_id) REFERENCES emojis(emoji_id),
        username VARCHAR(100) NOT NULL,
        FOREIGN KEY (username) REFERENCES users(username),
        article_id INT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
      )`);
    })
    .then(() => {
      const columns = ['slug', 'description', 'img_url'];

      return db.query(
        format(
          `INSERT INTO topics (${columns})
            VALUES %L;`,
          formatDataForSQL(columns, topicData)
        )
      );
    })
    .then(() => {
      const columns = ['username', 'name', 'avatar_url'];

      return db.query(
        format(
          `INSERT INTO users (${columns})
          VALUES %L;`,
          formatDataForSQL(columns, userData)
        )
      );
    })
    .then(() => {
      const columns = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'];

      return db.query(
        format(
          `INSERT INTO articles (${columns})
          VALUES %L RETURNING article_id, title;`,
          formatDataForSQL(columns, articleData)
        )
      );
    })
    .then(({ rows }) => {
      const lookup = createLookupObj(rows, 'title', 'article_id');

      commentData.forEach(comment => {
        comment.article_id = lookup[comment.article_title];
        delete comment.article_title;
      });

      const columns = ['article_id', 'body', 'votes', 'author', 'created_at'];

      return db.query(
        format(
          `INSERT INTO comments (${columns})
          VALUES %L;`,
          formatDataForSQL(columns, commentData)
        )
      );
    })
    .then(() => {
      const columns = ['emoji'];

      return db.query(
        format(
          `INSERT INTO emojis (${columns})
          VALUES %L;`,
          formatDataForSQL(columns, emojiData)
        )
      );
    })
    .then(() => {
      const columns = ['emoji_id', 'username', 'article_id'];

      return db.query(
        format(
          `INSERT INTO emoji_article_users (${columns})
          VALUES %L;`,
          formatDataForSQL(columns, emojiArticleUserData)
        )
      );
    })
    .finally(() => {
      console.log(
        `🌱 ${
          process.env.NODE_ENV.charAt(0).toUpperCase() + process.env.NODE_ENV.slice(1)
        } database seeded successfully`
      );
    });
};

module.exports = seed;
