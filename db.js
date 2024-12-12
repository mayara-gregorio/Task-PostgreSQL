const {Pool} = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
})

module.exports = pool