'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('SttWordsEn', 'source', { type: Sequelize.TEXT })
      .then(()=>{
        queryInterface.addColumn('SttWordsJa', 'source', { type: Sequelize.TEXT });
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('SttWordsEn', 'source')
      .then(()=>{
        queryInterface.removeColumn('SttWordsJa', 'source');
      });
  }
};
