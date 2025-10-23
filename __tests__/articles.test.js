const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const app = require('../app');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET /', () => {
  it('retreives an array of articles with the correct data', () => {
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
  it('retreives an array of articles in descending date order', () => {
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

describe('GET /:articleId', () => {
  it('retreives a single article with the given id', () => {
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
  it('throws a 404 error when given an articleId that does not exist', () => {
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
  it('throws a 400 error when given an invalid articeId', () => {
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
