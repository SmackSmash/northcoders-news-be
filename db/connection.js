const { Pool } = require('pg');
const { PGDATABASE, DATABASE_URL } = require('../config/keys');

if (!PGDATABASE && !DATABASE_URL) throw new Error('No PGDATABASE configured');

const config = DATABASE_URL ? { connectionString: DATABASE_URL, max: 2 } : { database: PGDATABASE };

const db = new Pool(config);

console.log(`🔗 Connected to ${PGDATABASE || 'supabase'}`);

module.exports = db;
