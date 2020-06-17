require('dotenv').config();

const orm = require(`${__dirname}'/../../models`),
  crypto = require('crypto')

const watson = require('watson-developer-cloud');

exports.validateId = (req, res, next) => {
  
  let error = new Error();

  orm.SttUser.findById(req.params.id)
    .then((result) => {
      if (result) {
        req.stt.user = result;
        next();
      } else {
        error.message = 'no user found';
        throw error;
      }
    }).catch( (err) => {
      res.status(400).json(err);
    });
    
};

exports.authenticate = (req, res) => {

  try {

    const authorization = new watson.AuthorizationV1({
      username: process.env.STT_USERNAME,
      password: process.env.STT_PASSWORD,
      url: `${process.env.STT_URL}/authorization/api`
    });

    authorization.getToken( {url: `${process.env.STT_URL}/speech-to-text/api`}, (err, token) => {
   
      if (!token) {
        throw({error: err});
      } 
      else {
        res.status(200).json({token: token});
      }
      
    });
  }
  catch (err) {
    res.status(404).json(err);
  }
};

exports.getDetails = (req, res) => {
};

exports.update = (req, res) => {
  let  error = new Error();
  let user =  {};

  try {
    req.body = JSON.parse(JSON.stringify(req.body));

    if (req.body.hasOwnProperty('adToken')) {
      user.adToken = req.body.adToken;
    }
    if (req.body.hasOwnProperty('enableVocabulary')) {
      user.enableVocabulary = req.body.enableVocabulary;
    }
    if (req.body.hasOwnProperty('CustomizationId')) {
      user.CustomizationId = req.body.CustomizationId;
    }
    if (req.body.hasOwnProperty('oldPassword')) {
      const oldPassword = crypto.createHash('md5').update(req.body.oldPassword).digest('hex');
      if (oldPassword !== req.stt.user.password) {
        error.message = 'password mismatch';
        throw error;
      } else {
        user.password = crypto.createHash('md5').update(req.body.newPassword).digest('hex');
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
  
  if(error.message === '' || error.message === null || error.message ===  undefined) {
    req.stt.user.update(user)
      .then((result) => {
        if (result) {
          res.status(200).json(req.stt.user);
        }
      }).catch((err) => {
        // console.log('pumasok kapa dito');
        res.status(400).json(err);
      });
  }


};