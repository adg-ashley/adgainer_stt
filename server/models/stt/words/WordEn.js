'use strict';
module.exports = (sequelize, DataTypes) => {
  var SttWordEn = sequelize.define('SttWordEn', {
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
        SttWordEn.belongsTo(models.SttCustomization);
        SttWordEn.belongsTo(models.SttUser);
        // associations can be defined here
      }
    },
    tableName: "SttWordsEn",
    timestamps: false
  });
  return SttWordEn;
};
