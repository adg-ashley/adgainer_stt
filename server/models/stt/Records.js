'use strict';
module.exports = (sequelize, DataTypes) => {
  var SttRecord = sequelize.define('SttRecord', {
    rid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: 'Untitled Record',
      allowNull: false,
      validate: {
        isEmpty (val) {
          if (val === '' || val === null || val == undefined) {
            this.name = 'Untitled Record';
          }
        }
      }
    },
    sourceType: {
      type: DataTypes.TEXT
    },
    sourceUrl: {
      type: DataTypes.TEXT
    },
    transcriptData: { 
      type: DataTypes.BLOB,
      defaultValue: ''
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    IsPinned:{ 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    }
  }, {
    classMethods: {
      associate: function(models) {
        SttRecord.belongsTo(models.SttUser);
        // SttRecord.belongsTo(models.SttCustomization);
      }
    },
    tableName: "SttRecords"
  });
  return SttRecord;
};