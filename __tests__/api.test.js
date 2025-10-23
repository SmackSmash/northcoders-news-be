const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const app = require('../app');

beforeAll(() => seed(data));
afterAll(() => db.end());

// TOPICS
describe('GET /api/topics', () => {
  it('200: retrieves an array of topics with the correct data', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(res => {
        const topics = res.body.topics;

        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);

        topics.forEach(topic => {
          const { slug, description, img_url } = topic;

          expect(typeof slug).toBe('string');
          expect(typeof description).toBe('string');
          expect(typeof img_url).toBe('string');
        });
      });
  });
});

// ARTICLES
describe('GET /api/articles', () => {
  it('200: retrieves an array of articles with the correct data', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(res => {
        const articles = res.body.articles;

        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach(article => {
          const { article_id, title, topic, body, author, created_at, votes, article_img_url, comment_count } = article;

          expect(typeof article_id).toBe('number');
          expect(typeof title).toBe('string');
          expect(typeof topic).toBe('string');
          expect(typeof author).toBe('string');
          expect(body).toBe(undefined);
          expect(typeof created_at).toBe('string');
          expect(typeof votes).toBe('number');
          expect(typeof article_img_url).toBe('string');
          expect(typeof comment_count).toBe('number');
        });
      });
  });
  it('200: retrieves an array of articles in descending date order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(res => {
        const articles = res.body.articles;

        articles.forEach((article, index) => {
          if (index > 0) {
            expect(Date.parse(article.created_at)).toBeLessThanOrEqual(Date.parse(articles[index - 1].created_at));
          }
        });
      });
  });
});

describe('GET /api/articles/:articleId', () => {
  it('200: retrieves a single article with the given articleId', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(res => {
        const article = res.body.article;

        expect(article).toBeInstanceOf(Object);

        const { article_id, title, topic, body, author, created_at, votes, article_img_url } = article;

        expect(typeof article_id).toBe('number');
        expect(typeof title).toBe('string');
        expect(typeof topic).toBe('string');
        expect(typeof author).toBe('string');
        expect(typeof body).toBe('string');
        expect(typeof created_at).toBe('string');
        expect(typeof votes).toBe('number');
        expect(typeof article_img_url).toBe('string');
      });
  });
  it('404: throws a 404 error when given an articleId that does not exist', () => {
    const articleId = 100000;

    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then(res => {
        const error = res.body.error;

        expect(error).toBeInstanceOf(Object);

        const { timestamp, status, errorMessage, path } = error;

        expect(typeof timestamp).toBe('string');
        expect(status).toBe(404);
        expect(errorMessage).toBe(`No article exists with id ${articleId}`);
        expect(typeof path).toBe('string');
      });
  });
  it('400: throws a 400 error when given an invalid articeId', () => {
    return request(app)
      .get('/api/articles/invalid')
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toBeInstanceOf(Object);

        const { timestamp, status, errorMessage, path } = error;

        expect(typeof timestamp).toBe('string');
        expect(status).toBe(400);
        expect(errorMessage).toBe('Invalid text representation');
        expect(typeof path).toBe('string');
      });
  });
});

describe('GET /api/articles/:articleId/comments', () => {
  it('200: retrieves a list of comments for the given articleId', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(res => {
        // const article = res.body.article;
        // expect(article).toBeInstanceOf(Object);
        // const { article_id, title, topic, body, author, created_at, votes, article_img_url } = article;
        // expect(typeof article_id).toBe('number');
        // expect(typeof title).toBe('string');
        // expect(typeof topic).toBe('string');
        // expect(typeof author).toBe('string');
        // expect(typeof body).toBe('string');
        // expect(typeof created_at).toBe('string');
        // expect(typeof votes).toBe('number');
        // expect(typeof article_img_url).toBe('string');
      });
  });
});

// USERS
describe('GET /api/users', () => {
  it('200: retrieves an array of users with the correct data', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(res => {
        const users = res.body.users;

        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);

        users.forEach(user => {
          const { username, name, avatar_url } = user;

          expect(typeof username).toBe('string');
          expect(typeof name).toBe('string');
          expect(typeof avatar_url).toBe('string');
        });
      });
  });
});

// 404
describe('GET /[invalidPath]', () => {
  it('returns a 404 error when visiting an invalid path', () => {
    return request(app)
      .get('/invalidPath')
      .expect(404)
      .then(res => {
        const error = res.body.error;

        expect(error).toBeInstanceOf(Object);

        const { timestamp, status, errorMessage, path } = error;

        expect(typeof timestamp).toBe('string');
        expect(status).toBe(404);
        expect(errorMessage).toBe('Not found');
        expect(typeof path).toBe('string');
      });
  });
});
