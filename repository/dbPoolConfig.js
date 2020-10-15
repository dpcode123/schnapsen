require('dotenv').config();
const pg = require('pg');
const Pool = pg.Pool;

/* const pool = new Pool({
    user: 'pptqjvjrjsqhln',
    host: 'ec2-52-70-15-120.compute-1.amazonaws.com',
    database: 'd8g5hgdk6hh9a0',
    password: 'ca2b83fda2ae9e6ba6235fa16e3f16c5b486d13fd7a9565dc54e1b102452270a',
    port: 5432,
    ssl: { rejectUnauthorized: false }
}); */
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