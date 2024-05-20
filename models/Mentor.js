const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");

class Mentor extends Model {
  static fields = {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    StaffRole: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    PairedWith: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  };
  async validPassword(password) {
    try {
      // compares passed in password with hashed password stored in mentor
      // hashes text password and compares to already hashed stored password
      // if they match, returns true
      // never revals real password
      const result = await bcrypt.compare(password, this.password);

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}

module.exports = Mentor;
