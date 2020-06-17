'use strict';
module.exports = (sequelize, DataTypes) => {
  var AdCampaign = sequelize.define('AdCampaign', {
    campaign_id: {
      type: DataTypes.TEXT,
      primaryKey: true
    },
    campaign_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        AdCampaign.hasMany(models.AdVoice);
      }
    },
    tableName: "campaigns",
    timestamps: false
  });
  return AdCampaign;
};
