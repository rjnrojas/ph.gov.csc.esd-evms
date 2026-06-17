const env = process.env.NODE_ENV?.trim() || 'dev';

const config = {
//   prod: {
//     host: process.env.DB_HOST || 'esd-server',
//     user: process.env.DB_USER || 'webmanager',
//     password: process.env.DB_PASSWORD || 'webmgrcscro10@123',
//     database: process.env.DB_NAME || 'esddms',
//     port: Number(process.env.DB_PORT || 3306)
//   },

  dev: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'esddms',
    port: Number(process.env.DB_PORT || 3306)
  }
};

const dbConfig = config[env] || config.dev;

module.exports = {
  env,
  config,
  dbConfig
};
