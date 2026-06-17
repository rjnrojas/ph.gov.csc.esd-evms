const mysql = require('mysql2');
const { dbConfig } = require('./config');

const db = mysql.createConnection(dbConfig);
// allow direct host access from server.js
db.host = dbConfig.host;

exports.db = db;
exports.dbConfig = dbConfig;