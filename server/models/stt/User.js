'use strict';
module.exports = (sequelize, DataTypes) => {
  var SttUser = sequelize.define('SttUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.TEXT,
    email: {
      type: DataTypes.TEXT,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    CustomizationId: { 
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        isEmpty (val) {
          if (val === '' || val === null || val == undefined || val === 0) {
            this.CustomizationId = 1;
          } 
        }
      }
    },
    enableVocabulary:{ 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    adToken: DataTypes.TEXT,
    language: DataTypes.STRING,
    verified:{ 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    resetToken: DataTypes.TEXT,
    isGoogleAuth:{ 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    }
  }, {
    classMethods: {
      associate: function(models) {
        SttUser.hasMany(models.SttRecord);
        SttUser.hasMany(models.SttWordEn);
        SttUser.hasMany(models.SttWordJa);

        SttUser.belongsTo(models.SttCustomization);
        // associations can be defined here
      }
    },
    tableName: "SttUsers",
    timestamps: true
  });
  return SttUser;
};
