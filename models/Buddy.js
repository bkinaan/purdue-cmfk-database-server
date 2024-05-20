const { DataTypes, Model } = require("sequelize");

class Buddy extends Model {
  static fields = {
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    School: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GradeLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  };

  static options = {
    indexes: [{ fields: ["School"] }, { fields: ["GradeLevel"] }],
  };
}

module.exports = Buddy;
