require('dotenv').config();

const orm = require(`${__dirname}'/../../models`),
  Op = orm.Sequelize.Op,
  concerns = require(`${__dirname}'/../concerns`),
  htmlToRtf = require('html-to-rtf'),
  moment = require('moment');

exports.validateRid = (req, res, next) => {
  
  let id = req.params.rid;
  orm.SttRecord.findById(id).then((record) => {
    if(record) {
      req.stt.record = record;
      next();
    }
    else {
      throw({error: 'not found record'});
    }
  }).catch((err) => {
    res.status(404).json(err);
  });
  
};

exports.all = (req, res) => {

  const p = concerns.p(req);
  let filter = req.query.filter ? req.query.filter : '';
  let searchQuery = {
    [Op.and]: [
      orm.Sequelize.where(
        orm.Sequelize.fn('concat',
          orm.Sequelize.col('rid'),
          ' ',
          orm.Sequelize.col('name'),
          ' ',
          orm.Sequelize.col('transcriptData')
        ),
        { like: `%${filter}%` }
      )
    ]
  };

  let limit = 10000; // limit is 10k
  if (parseInt(req.query.per_page) > 0) {
    limit = p.per_page;
  }

  orm.SttRecord.findAndCountAll({
    //attributes: { include: [[orm.sequelize.fn('CONVERT', orm.sequelize.col('transcriptData'), 'USING utf8'), 'transcriptData']] },
    where: {
      UserId: req.stt.user.id, // but me extacted to req.stt.user
      deletedAt: null,
      [Op.and]: [ searchQuery ]
    },
    offset: p.offset,
    limit: limit,
    order: [
      ['updatedAt', 'DESC']
    ]
  }).then((records) => {
    // convert transcriptData to uft-8 string
    records.rows.map((r) => {
      r.dataValues.transcriptData = r.dataValues.transcriptData ? r.dataValues.transcriptData.toString('utf8') : '';
      return r;
    });
    // records.rows = mapRecords;
    res.status(200).json(concerns.paginate(records, p, req));
  }).catch( (err) => {
    res.status(400).json(err);
  });
  
};


exports.create = function(req, res) {

  orm.SttRecord.findOrCreate({
    defaults: { UserId: req.stt.user.id, createdAt: Date.now() },
    where: {
      rid: req.body.rid,
      createdAt: {
        [Op.not]: null
      },
      deletedAt: null,
      UserId: req.stt.user.id
    },
    limit: 1
  }).spread((record, created) => {
    record.dataValues.transcriptData = record.dataValues.transcriptData ? record.dataValues.transcriptData.toString('utf8') : '';
    //console.log(record)
    res.status(200).json(Object.assign({created: created}, record.dataValues));
  }).catch (() => {
    res.status(400).json(false);
  });

};

exports.update = function(req, res) {
  console.log(moment().format('YYYY-MM-DD hh:mm:ss'))
  req.stt.record.update(Object.assign({}, { updatedAt: orm.sequelize.fn('NOW')} ,whiteList(req))).then(() => {
    res.status(200).json(true);
  });

};

exports.delete = function(req, res) {

  req.stt.record.update({ deletedAt: moment().format('YYYY-MM-DD H:mm:ss') })
    .then(() => {
      res.status(200).json(true);
    });

};

exports.restore = function(req, res) {

  req.stt.record.update({ deletedAt: null })
    .then(() => {
      res.status(200).json(true);
    });

};

exports.permanentDelete = function(req, res) {

  req.stt.record.destroy({ where: {
    rid: req.query.rid
  } })
    .then(() => {
      res.status(200).json(true);
    });

};

exports.favorites = function(req, res) {

  const p = concerns.p(req);
  let filter = req.query.filter ? req.query.filter : '';
  let searchQuery = {
    [Op.and]: [
      orm.Sequelize.where(
        orm.Sequelize.fn('concat',
          orm.Sequelize.col('rid'),
          ' ',
          orm.Sequelize.col('name'),
          ' ',
          orm.Sequelize.col('transcriptData')
        ),
        { like: `%${filter}%` }
      )
    ]
  };

  let limit = 10000; // limit is 10k
  if (parseInt(req.query.per_page) > 0) {
    limit = p.per_page;
  }

  orm.SttRecord.findAndCountAll({
    //attributes: { include: [[orm.sequelize.fn('CONVERT', orm.sequelize.col('transcriptData'), 'USING utf8'), 'transcriptData']] },
    where: {
      UserId: req.stt.user.id, // but me extacted to req.stt.user
      deletedAt: null,
      IsPinned: true,
      [Op.and]: [ searchQuery ]
    },
    offset: p.offset,
    limit: limit,
    order: [
      ['updatedAt', 'DESC']
    ]
  }).then((records) => {
    // convert transcriptData to uft-8 string
    records.rows.map((r) => {
      r.dataValues.transcriptData = r.dataValues.transcriptData ? r.dataValues.transcriptData.toString('utf8') : '';
      return r;
    });
    // records.rows = mapRecords;
    res.status(200).json(concerns.paginate(records, p, req));
  }).catch( (err) => {
    res.status(400).json(err);
  });

};

exports.trash = function(req, res) {

  const p = concerns.p(req);
  let filter = req.query.filter ? req.query.filter : '';
  let searchQuery = {
    [Op.and]: [
      orm.Sequelize.where(
        orm.Sequelize.fn('concat',
          orm.Sequelize.col('rid'),
          ' ',
          orm.Sequelize.col('name'),
          ' ',
          orm.Sequelize.col('transcriptData')
        ),
        { like: `%${filter}%` }
      )
    ]
  };

  let limit = 10000; // limit is 10k
  if (parseInt(req.query.per_page) > 0) {
    limit = p.per_page;
  }

  orm.SttRecord.findAndCountAll({
    //attributes: { include: [[orm.sequelize.fn('CONVERT', orm.sequelize.col('transcriptData'), 'USING utf8'), 'transcriptData']] },
    where: {
      UserId: req.stt.user.id, // but me extacted to req.stt.user
      deletedAt: {
        [Op.ne]: null
      },
      [Op.and]: [ searchQuery ]
    },
    offset: p.offset,
    limit: limit,
    order: [
      ['updatedAt', 'DESC']
    ]
  }).then((records) => {
    // convert transcriptData to uft-8 string
    records.rows.map((r) => {
      r.dataValues.transcriptData = r.dataValues.transcriptData ? r.dataValues.transcriptData.toString('utf8') : '';
      return r;
    });
    // records.rows = mapRecords;
    res.status(200).json(concerns.paginate(records, p, req));
  }).catch( (err) => {
    res.status(400).json(err);
  });

};

exports.download = function(req, res) {

  let content = req.stt.record.transcriptData ? req.stt.record.transcriptData.toString('utf-8') : '';
  // res.status(200).json(htmlToRtf.convertHtmlToRtf(`{\\rtf1\\ansi\\deff0{\\fonttbl {\\f0\\fnil\\fcharset0 Calibri;}{\\f1\\fnil\\fcharset2 Symbol;}}{\\colortbl ;} \\u12450 }`));
  res.status(200).json(htmlToRtf.convertHtmlToRtf(content));
};

const whiteList = function(req) {

  const allowed = [ 'name',  'transcriptData' ];

  let params = {};
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key) && allowed.includes(key)) {
      params[key] = req.body[key];
    }
  }
  return params;

};

exports.updatefavorite = (req, res) => {
  orm.SttRecord.findOne({ where: { rid: req.body.rid }
  }).then((record) => {
    if (record) {
      if (req.query.cancelDelete) {
        record.deletedAt = null
      }
      record.IsPinned = req.query.favorite
      record.save()
      res.status(200).json(true);
    }
  })
}