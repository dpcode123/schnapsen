require('dotenv').config();
const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({
    user: process.env.DB_PG_USER,
    host: process.env.DB_PG_HOST,
    database: process.env.DB_PG_DATABASE,
    password: process.env.DB_PG_PASSWORD,
    port: process.env.DB_PG_PORT,
    ssl: { rejectUnauthorized: false }
});

module.exports = {
    pool
}