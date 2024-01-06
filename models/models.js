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

// connects a Mentor and Buddy
// Buddy holds the foreign key
// TODO: how does linking them work?
Mentor.belongsTo(Buddy, { as: "paired_with", unique: true });
Buddy.hasOne(Mentor, { as: "paired_with", unique: true });

module.exports = {
  sequelize,
  Sequelize,
  Mentor,
  Buddy,
};
