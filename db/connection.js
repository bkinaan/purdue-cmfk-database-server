const { Sequelize } = require("sequelize");

// creating CLS and namespace to use the same transaction for every query
const cls = require("cls-hooked");
const namespace = cls.createNamespace("my-very-own-namespace");

// innitializing sequelize with the CLS and namespace
Sequelize.useCLS(namespace);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // Change this to your desired SQLite file location
});

module.exports = { sequelize, Op: Sequelize.Op };
