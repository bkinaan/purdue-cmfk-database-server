const { sequelize } = require("../db/connection");
const Sequelize = require("sequelize");

const Mentor = require("./Mentor");
const Buddy = require("./Buddy");

Mentor.init(Mentor.fields, {
  sequelize,
  modelName: "Mentor",
});

Buddy.init(Buddy.fields, {
  sequelize,
  modelName: "Buddy",
});

module.exports = {
  sequelize,
  Sequelize,
  Mentor,
  Buddy,
};
