const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const app = require('../app');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET /', () => {
  it('retreives an array of users with the correct data', () => {
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
