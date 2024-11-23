require("dotenv").config();
const mysql = require("mysql2"); // Import MySQL

// Check if the environment is production or development
const isProduction = process.env.NODE_ENV === "production";

// Create a connection to the MySQL database
const db = mysql.createConnection(
  isProduction
    ? {
        host: process.env.LIVE_DB_HOST,
        user: process.env.LIVE_DB_USER,
        password: process.env.LIVE_DB_PASS,
        database: process.env.LIVE_DB_NAME,
        port: process.env.LIVE_DB_PORT,
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      }
);

module.exports = db;
