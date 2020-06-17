require('dotenv').config();

const orm = require(`${__dirname}'/../../../models`), 
  Op = orm.Sequelize.Op,
  sequelize = orm.sequelize,
  concerns = require(`${__dirname}'/../../concerns`),
  sttV1 = require('watson-developer-cloud/speech-to-text/v1'), 
  speech_to_text = new sttV1({ 
    username: process.env.STT_USERNAME, 
    password: process.env.STT_PASSWORD
  });

let Word = orm.SttWordEn;

exports.getLang = (req, res, next) => {

  try {
    
    const key = 'SttWord' + (req.stt.customization.language[0].toUpperCase() + req.stt.customization.language.slice(1, 2));
    if (orm.hasOwnProperty(key)) {
      req.stt.Word = orm[key];
      next();
    } 
    else {
      throw({ error: 'not found word language' });
    }
    
  }
  catch (err){
    res.status(404).json(err);
  }
  
};

exports.getWord = (req, res, next) => {
  
  Word.find({
    where: { 
      id: req.params.id,
      UserId: req.stt.user.id
    }
  }).then((word) => {
    console.log(word)
    if (!word) throw({error: 'not found'});
    req.stt.word = word;
    next();
  }).catch((err) => {
    res.status(400).json(err);
  });
};

exports.all = (req, res) => {
 
  const p = concerns.p(req);

  let searchQuery = {};
  for( const wk in Word.rawAttributes ) {
    searchQuery[wk] = {like: `%${req.query.q}%`};
  }

  let searchPerLetter = {};
  if (req.query.hasOwnProperty('perLetter')
    && req.query.perLetter !== '' 
    && req.query.perLetter.length == 1) {
    searchPerLetter = sequelize.literal(` (LEFT(\`word\`,1) = '${req.query.perLetter}' OR LEFT(\`word_name\`,1) = '${req.query.perLetter}') `);
  }

  Word.findAndCountAll({
    where: { 
      CustomizationId: req.stt.customization.id,
      UserId: req.stt.user.id,
      [Op.and]: searchPerLetter,
      [Op.or]: searchQuery
    },
    offset: p.offset,
    limit: p.per_page,
    order: [
      ['word', 'ASC']
    ]
  }).then((words) => {
    res.status(200).json(concerns.paginate(words, p, req));
  });
 
};

exports.create = (req, res) => {

  try {

    const params = {
      word_name: req.body.word_name,
      word: (req.body.word || req.body.word_name),
      display_as: req.body.display_as
    }; 
    let customizationId = req.body.CustomizationId ? req.body.CustomizationId : req.stt.customization.id;
    speech_to_text.addWord(Object.assign({
      'content_type': 'application/json',
      'customization_id': req.stt.customization.customization_id,
      sounds_like: req.body.sounds_like
    }, params), (err) => {
      if (err) {
        res.status(400).json({error: err.message});
      }
      else {
        Word.findOrCreate({
          where: Object.assign({ 
            CustomizationId: customizationId,
            sounds_like: req.body.sounds_like.toString(),
            UserId: req.stt.user.id
          }, params)
        }).then((word) => {
          res.status(200).json({ notice: "succesfully added", data: word });
        });
      }
    });

  }
  catch (err) {
    res.status(400).json(err);
  }

};

exports.show = (req, res) => {
  res.status(200).json({data: req.stt.word});
};

exports.destroy = (req, res) => {
   
  try {
    speech_to_text.deleteWord({
      word_name: req.stt.word.word_name,
      word: req.stt.word.word,
      customization_id: req.stt.customization.customization_id
    }, (err, word) => {
      if (err) res.status(400).json({error: err.message});
      if (word) { 
        req.stt.word.destroy();
        res.status(200).json({data: word});
      }
   
    });
  } catch (err) {
    res.status(404).json(err);
  }
  // res.status(200).json({data: req.stt.word});

};

// ** TODO
exports.update = (req, res) => {
};



