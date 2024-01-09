const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");

class Mentor extends Model {
  static fields = {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
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

  // static hooks = {
  //   beforeCreate: async (mentor, options) => {
  //     console.log("BEFORE CREATE");
  //     try {
  //       mentor.password = await bcrypt.hash(
  //         mentor.password,
  //         parseInt(process.env.SALT_ROUNDS)
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   beforeUpdate: async (mentor, options) => {
  //     console.log("BEFORE UPDATE");
  //     try {
  //       mentor.password = await bcrypt.hash(
  //         mentor.password,
  //         parseInt(process.env.SALT_ROUNDS)
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  // };

  async validPassword(password) {
    try {
      // compares passed in password with hashed password stored in mentor
      const result = await bcrypt.compare(password, this.password);

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // remove password from mentor before sending to client
  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}

module.exports = Mentor;
