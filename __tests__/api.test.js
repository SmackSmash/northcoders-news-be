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

        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBeGreaterThan(0);

        topics.forEach(topic => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
              img_url: expect.any(String)
            })
          );
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

        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number)
            })
          );

          expect(article).toEqual(expect.not.objectContaining({ body: expect.any(String) }));
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

        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
          })
        );
      });
  });
  it('404: throws a 404 error when given an articleId that does not exist', () => {
    const articleId = 100000;

    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 404,
            errorMessage: `No article exists with id ${articleId}`,
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when given an invalid articeId', () => {
    return request(app)
      .get('/api/articles/invalid')
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Invalid text representation',
            path: expect.any(String)
          })
        );
      });
  });
});

describe('GET /api/articles/:articleId/comments', () => {
  it('200: retrieves a list of comments for the given articleId', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(res => {
        const comments = res.body.comments;

        expect(comments).toBeInstanceOf(Array);

        comments.forEach(comment => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String)
            })
          );
        });
      });
  });
  it('404: throws a 404 error when given an articleId that does not exist', () => {
    const articleId = 100000;

    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(404)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 404,
            errorMessage: `No comments exist for article with id ${articleId}`,
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when given an invalid articeId', () => {
    return request(app)
      .get('/api/articles/invalid/comments')
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Invalid text representation',
            path: expect.any(String)
          })
        );
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

        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);

        users.forEach(user => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          );
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

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 404,
            errorMessage: 'Not found',
            path: expect.any(String)
          })
        );
      });
  });
});
