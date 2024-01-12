const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // Change this to your desired SQLite file location
});

module.exports = { sequelize, Op: Sequelize.Op };
