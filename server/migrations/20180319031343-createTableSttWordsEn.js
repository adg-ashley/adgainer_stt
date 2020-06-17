'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('SttWordsEn', { 
      id: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CustomizationId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      word_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false
      },
      display_as: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sounds_like: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('SttWordsEn');
  }
};
