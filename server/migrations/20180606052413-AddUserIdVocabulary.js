'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('SttWordsEn', 'UserId', { type: Sequelize.INTEGER })
      .then (() =>{
        queryInterface.addColumn('SttWordsJa', 'UserId', { type: Sequelize.INTEGER });
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('SttWordsEn', 'UserId')
      .then (() => {
        queryInterface.removeColumn('SttWordsJa', 'UserId', { type: Sequelize.INTEGER });
      });
  }
};
