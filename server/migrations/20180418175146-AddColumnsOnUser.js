'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('SttUsers', 'firstname', { type: Sequelize.STRING })
      .then(() => {
        queryInterface.addColumn('SttUsers', 'lastname', { type: Sequelize.STRING })
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('SttUsers', 'firstname', { type: Sequelize.STRING })
      .then(() => {
        queryInterface.removeColumn('SttUsers', 'lastname', { type: Sequelize.STRING })
      });
  }
};
