const { DataTypes, Model } = require("sequelize");

class Mentor extends Model {
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
    EmailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    NonSchoolEmailAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ActivityDays: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    PrimaryStaffRole: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    SecondaryStaffRole: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  };
}

module.exports = Mentor;
