'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdAccount = sequelize.define('AdAccount', {
    account_id: { 
      type: DataTypes.TEXT,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    //account_id: DataTypes.TEXT,
    accountName: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function() {
        // associations can be defined here
        // AdAccount.hasMany(models.AdVoice, { sourceKey: "account_id"});
        // orm.AdAccount.hasMany(orm.AdVoice, { foreignKey: 'account_id', sourcekey: "account_id"   });
      }
    },
    tableName: "accounts",
    timestamps: false
  });
  return AdAccount;
};
