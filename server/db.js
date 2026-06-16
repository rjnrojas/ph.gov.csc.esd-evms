const mysql = require('mysql2');

// dev location
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'esddms',
  port: 3306
};

const db = mysql.createConnection(dbConfig);
// allow direct host access from server.js
db.host = dbConfig.host;
exports.db = db;
exports.dbConfig = dbConfig;

// prod
// const dbConfig = {
//   host: 'esd-server',
//   user: 'webmanager',
//   password: 'webmgrcscro10@123',
//   database: 'esddms',
//   port: 3306
// };
//
// const db = mysql.createConnection(dbConfig);
// db.host = dbConfig.host;
// exports.db = db;

// qr
const db_qr = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'esddms',
  port: 3306
});
exports.db_qr = db_qr;

