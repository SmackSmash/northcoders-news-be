const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const app = require('../app');

beforeEach(() => seed(data));
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
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
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
            errorMessage: 'Invalid input syntax',
            path: expect.any(String)
          })
        );
      });
  });
});

describe('PATCH /api/articles/:articleId', () => {
  it('200: returns an updated article with the new vote count for a given articleId', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 1
      })
      .expect(200)
      .then(res => {
        const article = res.body.article;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 101,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          })
        );
      });
  });
  it('404: throws a 404 error when given an articleId that does not exist', () => {
    const articleId = 100000;

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({
        inc_votes: 1
      })
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
      .patch('/api/articles/invalid')
      .send({
        inc_votes: 1
      })
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Invalid input syntax',
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when no inc_votes key is passed in the body', () => {
    return request(app)
      .patch('/api/articles/1')
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Request body must have an "inc_votes" property',
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when given an invalid inc_votes value', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 'invalid'
      })
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Vote value must be a number',
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
  it('200: retrieves an array of comments in descending date order', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(res => {
        const comments = res.body.comments;

        comments.forEach((comment, index) => {
          if (index > 0) {
            expect(Date.parse(comment.created_at)).toBeLessThanOrEqual(Date.parse(comments[index - 1].created_at));
          }
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
            errorMessage: 'Invalid input syntax',
            path: expect.any(String)
          })
        );
      });
  });
});

describe('POST /api/articles/:articleId/comments', () => {
  it('200: adds a comment to the db and responds with the posted comment', () => {
    const articleId = 1;
    const commentData = { username: 'butter_bridge', body: 'this is only a test' };

    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(commentData)
      .expect(200)
      .then(res => {
        const comment = res.body.comment;

        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: articleId,
            body: commentData.body,
            votes: 0,
            author: commentData.username,
            created_at: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when given an articleId that does not exist in the articles table', () => {
    const articleId = 100000;
    const commentData = { username: 'butter_bridge', body: 'this is only a test' };

    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(commentData)
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: `Foreign key violation`,
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when given an invalid articleId', () => {
    return request(app)
      .post(`/api/articles/invalid/comments`)
      .send({ username: 'butter_bridge', body: 'this is only a test' })
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Invalid input syntax',
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when given invalid comment data', () => {
    return request(app)
      .post(`/api/articles/1/comments`)
      .send({ bad: 'butter_bridge', data: 'this is only a test' })
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Invalid comment data',
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when passed a username that does not exist in the users table', () => {
    return request(app)
      .post(`/api/articles/1/comments`)
      .send({ username: 'unknown', body: 'this is only a test' })
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: `Foreign key violation`,
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

// COMMENTS
describe('DELETE /api/comments/:commentId', () => {
  it('204: deletes the comment and returns nothing when passed a valid commentId', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(res => {
        expect(res.body).toEqual({});
      });
  });
  it('404: throws a 404 error when given a commentId that does not exist', () => {
    const commentId = 100000;

    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(404)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 404,
            errorMessage: `No comment found with id ${commentId}`,
            path: expect.any(String)
          })
        );
      });
  });
  it('400: throws a 400 error when passed an invalid commentId', () => {
    return request(app)
      .delete('/api/comments/invalid')
      .expect(400)
      .then(res => {
        const error = res.body.error;

        expect(error).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            status: 400,
            errorMessage: 'Invalid input syntax',
            path: expect.any(String)
          })
        );
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
