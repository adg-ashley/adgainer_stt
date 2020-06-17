require('dotenv').config();

const orm = require(`${__dirname}'/../../models`),
  Op = orm.Sequelize.Op,
  concerns = require(`${__dirname}'/../concerns`);

exports.all = (req, res) => {
  const p = concerns.p(req);

  orm.AdAccount.hasMany(orm.AdVoice, { foreignKey: 'account_id', sourcekey: "account_id" });
  orm.AdVoice.belongsTo(orm.AdAccount, { foreignKey: 'account_id', targetKey: "account_id" });

  orm.AdCampaign.hasMany(orm.AdVoice, { foreignKey: 'campaign_id', sourcekey: "campaign_id" });
  orm.AdVoice.belongsTo(orm.AdCampaign, { foreignKey: 'campaign_id', targetKey: "campaign_id" });
  
  let filter = { 
    call_id: {
      [Op.ne]: null
    }
  };

  if (req.ad.user.cid !== '35bsm4n4bu4mu5um')
  {
    //console.log(req.ad.user)
    filter['account_id'] = req.ad.user.cid;
  }
  orm.AdVoice.findAndCountAll({
    include: [
      { model: orm.AdAccount, as: 'AdAccount' },
      { model: orm.AdCampaign, as: 'AdCampaign' }
    ],
    offset: p.offset,
    limit: p.per_page,
    order: [
      ['id', 'ASC']
    ],
    where: filter
  //}).then( (result) => {
  //  return result
  }).then( (voices) => {
    res.status(200).json(concerns.paginate(voices, p, req));
  }).catch( (err) => {
    res.status(400).json(err);
  });
  
};
