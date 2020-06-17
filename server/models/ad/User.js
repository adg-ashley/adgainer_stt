'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('AdUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    account_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function() {
        // associations can be defined here
      }
    },
    tableName: "users",
    timestamps: false
  });
  return User;
};
