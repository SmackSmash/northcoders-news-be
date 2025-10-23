const request = require('supertest');
const app = require('../app');

describe('GET /invalidPath', () => {
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
