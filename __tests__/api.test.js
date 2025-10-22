const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const app = require('../app');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () => {
  test('GET /', () => {
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
