module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  db: {
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
};
