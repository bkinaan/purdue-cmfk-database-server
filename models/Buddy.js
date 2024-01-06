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
    Allergies: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    MedicalConditions: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    DietaryRestrictions: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    CarriesInhaler: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    CarriesEpiPen: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    HasLearningSocialDevelopmentalEmotionalIssues: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    IssueDetails: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    Medications: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    Other: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GuardianFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GuardianLastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GuardianRelationship: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GuardianPrimaryPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GuardianAltPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    GuardianEmailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    EmergencyContactFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    EmergencyContactLastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    EmergencyContactRelationship: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    EmergencyContactPhone1: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    SafetyNotes: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    ApprovedForPickupFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    ApprovedForPickupLastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    ApprovedForPickupRelationship: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    ApprovedForPickupPrimaryPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    PairedWith: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    FavoriteSubject: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    HobbiesAndInterests: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  };
}

module.exports = Buddy;
