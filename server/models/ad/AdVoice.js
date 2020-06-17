'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdVoice = sequelize.define('AdVoice', {
    unique_call_id: DataTypes.TEXT,
    phone_number: DataTypes.STRING,
    caller_phone: DataTypes.STRING,
    account_id: DataTypes.TEXT,
    campaign_id: DataTypes.TEXT
    // accountId: DataTypes.TEXT,
    // campaignId: DataTypes.TEXT,
    // trackingNumber: DataTypes.TEXT,
    // fileName: DataTypes.TEXT,
    // fileType: DataTypes.TEXT,
    // filePath: DataTypes.TEXT,
    // transcript: DataTypes.TEXT,
    // status: DataTypes.INTEGER,
    // retry: DataTypes.INTEGER,
    // stage: DataTypes.INTEGER,
  }, 
  {
    classMethods: {
      associate: function(orm) {
        // associations can be defined here
        //AdVoice.belongsTo(models.AdAccount, 
        //  { foreignKey: 'account_id', targetKey: "account_id"});
        //AdVoice.belongsTo(models.AdCampaign, 
        //  { foreignKey: 'campaign_id', targetKey: "campaign_id"});
        // orm.AdVoice.belongsTo(orm.AdAccount, { foreignKey: 'account_id', targetKey: "account_id" });
      }
    },
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        columns: ['campaign_id', 'account_id']
      }
    ],
    tableName: "phone_time_use",
    timestamps: false
  });
  return AdVoice;
};