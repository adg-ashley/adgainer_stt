'use strict';
module.exports = (sequelize, DataTypes) => {
  var SttWordJa = sequelize.define('SttWordJa', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    CustomizationId: {
      type: DataTypes.INTEGER
    },
    word_name: DataTypes.STRING,
    word: DataTypes.STRING,
    display_as: DataTypes.STRING,
    sounds_like: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        SttWordJa.belongsTo(models.SttCustomization);
        SttWordJa.belongsTo(models.SttUser);
        // associations can be defined here
      }
    },
    tableName: "SttWordsJa",
    timestamps: false
  });
  return SttWordJa;
};
