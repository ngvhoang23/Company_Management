const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "comdb",
  charset: "utf8mb4",
  multipleStatements: true,
});

module.exports = db;
