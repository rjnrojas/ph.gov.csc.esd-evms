const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'esddms',
  port: 3306
});
exports.db = db;


const db_qr = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'esddms',
  port: 3306
});
exports.db_qr = db_qr;
