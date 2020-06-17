const orm = require(`${__dirname}'/../../../models`);

exports.validateId = (req, res, next) => {
  
  let id = req.params.id ? req.params.id : req.params.CustomizationId;
  orm.SttCustomization.findById(id, {raw: true}).then((customization) => {
    if(customization) {
      req.stt.customization = customization;
      next();
    }
    else {
      throw({error: 'not found customization'});
    }
  }).catch((err) => {
    res.status(404).json(err);
  });

};

exports.all = (req, res) => {
  orm.SttCustomization.findAll()
    .then((models) => {
      res.status(200).json(models);
    });
};

exports.getCustomizations = (req, res) => {
  orm.SttCustomization.findAndCountAll({
    where: { enable: req.query.inUse }
  }).then(function(customizations) {
    res.json({ data: customizations.rows });
  });
}