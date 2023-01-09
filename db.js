const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  "telegram_bot",
  "root",
  "root",

  {
    host: "45.130.8.150",
    port: "6432",
    dialect: "postgres",
  }
);
