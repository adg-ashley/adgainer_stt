'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SttVoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    callId: {
      type: Sequelize.TEXT
    },
    accountId: {
      type: Sequelize.TEXT
    },
    campaignId: {
      type: Sequelize.TEXT
    },
    trackingNumber: {
      type: Sequelize.TEXT
    },
    fileName: {
      type: Sequelize.TEXT
    },
    fileType: {
      type: Sequelize.TEXT
    },
    filePath: {
      type: Sequelize.TEXT
    },
    transcript: {
      type: Sequelize.TEXT
    },
    status: {
      type: Sequelize.INTEGER
    },
    retry: {
      type: Sequelize.INTEGER
    },
    stage: {
      type: Sequelize.INTEGER
    }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SttVoices');
  }
};