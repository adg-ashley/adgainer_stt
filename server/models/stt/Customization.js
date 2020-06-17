'use strict';
module.exports = (sequelize, DataTypes) => {
  const SttCustomization = sequelize.define('SttCustomization', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customization_id: {
      type: DataTypes.TEXT
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    base_model_name: DataTypes.STRING,
    dialect: DataTypes.STRING,
    language: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        SttCustomization.hasMany(models.SttUser);
        // SttCustomization.hasMany(models.SttRecord);
        // associations can be defined here
      }
    },
    tableName: "SttCustomizations",
    timestamps: false
  });
  return SttCustomization;
};
