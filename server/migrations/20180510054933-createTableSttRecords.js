'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SttRecords', {
      rid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: 'Untitled Record',
        allowNull: false
      },
      sourceType: {
        type: Sequelize.TEXT
      },
      sourceUrl: {
        type: Sequelize.TEXT
      },
      sourceStatus: {
        type: Sequelize.INTEGER
      },
      transcriptData: Sequelize.BLOB,
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SttRecords');
  }
};