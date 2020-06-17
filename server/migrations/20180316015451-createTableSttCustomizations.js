'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('SttCustomizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: Sequelize.STRING,
      customization_id: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      base_model_name: Sequelize.STRING,
      dialect: Sequelize.STRING,
      language: Sequelize.STRING,
      status: Sequelize.STRING,
      enable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },

  down: (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('SttCustomizations');
  }
};
