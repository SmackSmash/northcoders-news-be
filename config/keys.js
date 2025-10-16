require('dotenv').config();

switch (process.env.NODE_ENV) {
  case 'development':
    module.exports = require('./devKeys');
    break;
  case 'test':
    module.exports = require('./testKeys');
    break;
  default:
    module.exports = require('./prodKeys');
}
