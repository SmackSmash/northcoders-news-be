const format = require('pg-format');
const db = require('../connection');
const { formatDataForSQL, createLookupObj } = require('./utils');

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
  emojiArticleUserData,
  userTopicData,
  userArticleVoteData
}) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return Promise.all([
        db.query(`DROP TABLE IF EXISTS user_topics;`),
        db.query(`DROP TABLE IF EXISTS user_article_votes;`),
        db.query(`DROP TABLE IF EXISTS emoji_article_users;`)
      ]);
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR(1000) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        author VARCHAR(100) NOT NULL,
        FOREIGN KEY (author) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE emojis(
        emoji_id SERIAL PRIMARY KEY,
        emoji CHAR NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE emoji_article_users(
        emoji_article_user_id SERIAL PRIMARY KEY,
        emoji_id INT NOT NULL,
        FOREIGN KEY (emoji_id) REFERENCES emojis(emoji_id),
        username VARCHAR(100) NOT NULL,
        FOREIGN KEY (username) REFERENCES users(username),
        article_id INT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        UNIQUE (emoji_id, username, article_id)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE user_topics(
        user_topic_id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        FOREIGN KEY (username) REFERENCES users(username),
        topic VARCHAR(100) NOT NULL,
        FOREIGN KEY (topic) REFERENCES topics(slug),
        UNIQUE (username, topic)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE user_article_votes(
        user_article_votes_id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        FOREIGN KEY (username) REFERENCES users(username),
        article_id INT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        vote_count INT DEFAULT 0 NOT NULL,
        UNIQUE (username, article_id, vote_count)
      );`);
    })
    .then(() => {
      const columns = ['slug', 'description', 'img_url'];

      return db.query(format(`INSERT INTO topics (${columns}) VALUES %L;`, formatDataForSQL(columns, topicData)));
    })
    .then(() => {
      const columns = ['username', 'name', 'avatar_url'];

      return db.query(format(`INSERT INTO users (${columns}) VALUES %L;`, formatDataForSQL(columns, userData)));
    })
    .then(() => {
      const columns = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'];

      return db.query(
        format(
          `INSERT INTO articles (${columns}) VALUES %L RETURNING article_id, title;`,
          formatDataForSQL(columns, articleData)
        )
      );
    })
    .then(({ rows }) => {
      const lookup = createLookupObj(rows, 'title', 'article_id');

      const commentDataWithArticleId = commentData.map(({ article_title, body, votes, author, created_at }) => ({
        article_id: lookup[article_title],
        body,
        votes,
        author,
        created_at
      }));

      const columns = ['article_id', 'body', 'votes', 'author', 'created_at'];

      return db.query(
        format(`INSERT INTO comments (${columns}) VALUES %L;`, formatDataForSQL(columns, commentDataWithArticleId))
      );
    })
    .then(() => {
      const columns = ['emoji'];

      return db.query(format(`INSERT INTO emojis (${columns}) VALUES %L;`, formatDataForSQL(columns, emojiData)));
    })
    .then(() => {
      const columns = ['emoji_id', 'username', 'article_id'];

      return db.query(
        format(
          `INSERT INTO emoji_article_users (${columns}) VALUES %L;`,
          formatDataForSQL(columns, emojiArticleUserData)
        )
      );
    })
    .then(() => {
      const columns = ['username', 'topic'];

      return db.query(
        format(`INSERT INTO user_topics (${columns}) VALUES %L;`, formatDataForSQL(columns, userTopicData))
      );
    })
    .then(() => {
      const columns = ['username', 'article_id', 'vote_count'];

      return db.query(
        format(`INSERT INTO user_article_votes (${columns}) VALUES %L;`, formatDataForSQL(columns, userArticleVoteData))
      );
    })
    .then(() => {
      console.log(
        `🌱 ${
          process.env.NODE_ENV.charAt(0).toUpperCase() + process.env.NODE_ENV.slice(1)
        } database seeded successfully`
      );
    })
    .catch(err => console.error(err.message));
};

module.exports = seed;
