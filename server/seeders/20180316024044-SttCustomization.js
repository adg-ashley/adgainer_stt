'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('SttCustomizations', [
      {
        customization_id: 'd7972452-737e-48e7-aa51-58054c4485b5',
        name: 'English',
        description: 'English',
        base_model_name: 'en-US_BroadbandModel',
        dialect: 'en-US',
        language: 'en-US',
        enable: true,
        status: 'available'
      },
      {
        customization_id: '5977a78d-1e73-417f-bda5-ea6bbde9c412',
        name: '日本語',
        description: '日本語',
        base_model_name: 'ja-JP_BroadbandModel',
        dialect: 'ja-JP',
        language: 'ja-JP',
        enable: true,
        status: 'available'
      }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('SttCustomizations', null, {});
  }
};
