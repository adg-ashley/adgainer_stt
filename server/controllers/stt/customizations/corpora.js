require('dotenv').config();

const  fs = require('fs'),
  sttV1 = require('watson-developer-cloud/speech-to-text/v1'), 
  speech_to_text = new sttV1({ 
    username: process.env.STT_USERNAME, 
    password: process.env.STT_PASSWORD
  }),
  multer = require('multer'),
  upload = multer({
    dest: (req, file, callback) => {
      callback(null, '/tmp');
    },
    filename: (req, file, callback) => {
      callback(null, file.fieldname + '-' + Date.now());
    }
  }).single('corpus');

exports.create = (req, res) => {

  upload(req, res, (err) => {

    const fileStream = fs.createReadStream(req.file.path);
 
    if(!err) {

      speech_to_text.addCorpus({
        customization_id: req.stt.customization.customization_id,
        corpus_name: req.file.filename,
        corpus_file: fileStream,
        allowOverride: true
      }, (err, result) => {
        if (err) res.status(400).json({ error: err });
        if (result) {
          res.status(400).json({notice: 'sucessefsully uploaded corpus', data: result});
        }
      });

    }

  });

};
