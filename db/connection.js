const { Pool } = require('pg');
const { PGDATABASE } = require('../config/keys');

const db = new Pool({ database: PGDATABASE });

if (!PGDATABASE) {
  throw new Error('No PGDATABASE configured');
} else {
  console.log(`Connected to ${PGDATABASE}`);
}

module.exports = db;
