const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'ca-certificate.crt')).toString(),
    rejectUnauthorized: true
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 