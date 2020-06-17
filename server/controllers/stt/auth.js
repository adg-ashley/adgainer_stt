require('dotenv').config();

const orm = require(`${__dirname}'/../../models`),
  Op = orm.Sequelize.Op,
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  nodemailer = require("nodemailer"),
  util = require('util');

  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });
  var rand,mailOptions,link,userDetails,token, subj, txt, subjConfirm, txtConfirm, newAccount;

  token = crypto.randomBytes(20).toString('hex');
  rand = Math.floor((Math.random() * 100) + 54);

exports.login = (req, res) => {

  var errors = {},
    err = new Error();
  try {
    if (!req.body.credential) {
      errors.credential = { type: 'error', text: 'Username / Email required' };
    }
    if (!req.body.password) {
      errors.password = { type: 'error', text: 'Password required' };
    }

    if (isEmpty(errors)) {
      err.messages = errors;
      throw err;
    }
  } 
  catch (err) {
    //console.log(JSON.stringify(err));
    res.status(400).json(err);
  }
  
  orm.SttUser.findAll({
    where:{[Op.or]: [{username: req.body.credential}, {email: req.body.credential}]},
    limit: 1,
    raw: true
  }).then((users) => {
  
    if (users.length === 0) { 
      err.message = { type: 'error', text: 'Username does not exist' };
      throw err;
    }
    return users.pop();
  }).then((user) => {
    const password = crypto.createHash('md5').update(req.body.password).digest("hex");
    if (password !== user.password) { 
      err.message = { type: 'error', text: 'Incorrect Password' };
      throw err;
    }
    return user;
  }).then((user) => {
    let resText = user.language == 'en-us' ? 'Logged In Successfully!' : '正常にログインしました！'
    const payload = { id: user.id, username: user.username, CustomizationId: user.CustomizationId };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30 days' });
    let userClone = Object.assign({token: token}, user);
    delete userClone.password;
    res.status(200).json({ user: userClone, message: { text: resText, type: 'notice'} });
  }).catch((err) => {
    res.status(400).json(err);
  });
};

exports.idle = (req, res) => {
  orm.SttUser.findAll({
    where:{ username: req.body.username },
    limit: 1,
    raw: true
  }).then((users) => {
    if (users.length === 0) { 
      err.message = { type: 'error', text: 'Username does not exist' };
      throw err;
    }
    return users.pop();
  }).then((user) => {
    const password = crypto.createHash('md5').update(req.body.password).digest("hex");
    if (password !== user.password) { 
      err.message = { type: 'error', text: 'Incorrect Password' };
      throw err;
    }
    return user;
  }).then((user) => {
    res.status(200).json({ message: { text: 'Logged In Successfully!', type: 'notice'} });
  }).catch((err) => {
    res.status(400).json(err);
  });
};

exports.googleauth = (req, res) => {
  const { OAuth2Client } = require('google-auth-library');
  const idToken = req.body.id_token // the token received from the JS client
  const audiance = req.body.gapi; // gapi client id
  var gapiClient = new OAuth2Client(audiance, '', '');
  gapiClient.verifyIdToken({idToken, audiance}).then(login => {
    var payload = login.getPayload();
    var users = new Promise((resolve, reject) => { orm.SttUser.findAndCountAll({
      where: { email: payload.email },
      raw: true,
      limit: 1
    })
      .then((user) => {
        console.log(payload)
        var data;
        if (user.count > 0) {
          data = user
          console.log('existing user: ', user.count)
        } else {
          data = null
        }
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
    })
    users.then((data) => {
      if (data != null) {
        console.log(data.rows[0])
        if (data.rows[0].isGoogleAuth != false) {
          const userPayload = { id: data.rows[0].id, username: data.rows[0].username, CustomizationId: data.rows[0].CustomizationId };
          const userToken = jwt.sign(userPayload, process.env.SECRET, { expiresIn: '30 days' });
          let userClone = Object.assign({token: userToken}, data.rows[0]);
          res.status(200).json({ user: userClone, message: { text: 'Logged In Successfully!', type: 'notice'} });
        }
        else {
          res.status(400).json({message: { text: 'Email already used through Sign up!', type: 'notice'}})
        }
      } else {
        newAccount = true
        orm.SttUser.create({
          username: payload.email,
          email: payload.email,
          password: null,
          CustomizationId: 0,
          enableVocabulary: 1,
          adToken: null,
          language: 'en-us',
          firstname: payload.given_name,
          lastname: payload.family_name,
          verified: true,
          isGoogleAuth: true
        }).then((dataObj) => {
          const user = dataObj.get({plain:true})
          const userPayload = { id: user.id, username: user.username, CustomizationId: user.CustomizationId };
          const userToken = jwt.sign(userPayload, process.env.SECRET, { expiresIn: '30 days' });
          let userClone = Object.assign({token: userToken}, user);
          res.status(200).json({ user: userClone, newAccount: newAccount, message: { text: 'Sign in successful. Please set your password!', type: 'notice'} });
        })
      }
    }).catch((err) => {
      console.log(err)
      res.status(400).json({err})
    })
  })
  .catch((err) => {
    console.log(err)
    res.status(400).json(err);
  })
}

const isEmpty = (obj) => {
  return (Object.keys(obj).length !== 0 && obj.constructor === Object) ? true : false;
};

exports.recover = (req, res) => {
  orm.SttUser.findOne({ where: { email: req.body.email }
  }).then((user) => {
    if (user) {
      link = process.env.SERVER_URL+"/reset?token="+token
      if (user.language == 'en-us') {
        subj = 'Password Reset request'
        txt = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        link + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      } else {
        subj = '「パスワードリセットの認証」'
        txt = 'あなたまたは他の誰かがアカウントのパスワードを変更したため、こちらのメールをを受け取るようになっています。\n\n' +
        '次のリンクをクリックするか、ブラウザに貼り付けて処理を完了してください:\n\n' +
        link + '\n\n' +
        'もしパスワードの変更を要求していない場合はこのメールを無視してください。こちらのパスワードは変更されません。\n'
      }
      user.resetToken = token
      user.save()
      mailOptions = {
        to: req.body.email,
        subject: subj,
        text: txt
      };
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
        done(err, 'done');
      });
      res.status(200).json({ key: token, message: { text: 'Email has been send to the provided email address.', type: 'positive'} });
    }
  }).catch ((err) => {
    res.status(400).json({ message: { text: 'Account with provided Email does not exist.', type: 'notice'} });
  })
}

exports.reset = (req, res) => {
  var md5_password = crypto.createHash('md5').update(req.body.password).digest("hex");

  orm.SttUser.findOne({ where: { resetToken: req.body.resetToken }
  }).then((user) => {
    if (user) {
      user.password = md5_password
      user.resetToken = null
      user.save()
      res.status(200).json({ message: { text: 'Password Updated', type: 'positive'} });
    }
  }).catch ((err) => {
    res.status(400).json({ message: { text: 'Error', type: 'notice'} });
  })
}

exports.setpassword = (req, res) => {
  var md5_password = crypto.createHash('md5').update(req.body.password).digest("hex");

  orm.SttUser.findOne({ where: { email: req.body.email }
  }).then((user) => {
    if (user) {
      user.password = md5_password
      user.save()
      res.status(200).json({ message: { text: 'Password Updated', type: 'positive'} });
    }
  }).catch ((err) => {
    res.status(400).json({ message: { text: 'Error', type: 'notice'} });
  })
}

exports.send = (req, res) => {
  userDetails = req.body
  register(userDetails)
    .then((success) => {
      if (success) {
        link = process.env.SERVER_URL+"/verify?id="+rand;
        if (req.body.lang == 'en-us') {
          subjConfirm = "Please confirm your Email account"
          txtConfirm = "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        } else {
          subjConfirm = 'あなたのメールアドレスを確認してください',
          txtConfirm = "こんにちは、<br> リンクをクリックしてメールを確認してください。<br><a href="+link+">確認するにはこちらをクリックしてください</a>"
        }
        mailOptions = {
          to : req.body.email,
          subject : subjConfirm,
          html : txtConfirm
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response) {
          if(error) {
            console.log(error);
            res.end("error");
          }
          else {
            console.log("Message sent: " + response.message);
            res.end("sent");
          }
        });
        res.status(200).json({ key: rand, message: { text: 'Registered Successfully! Please check your email for verification', type: 'positive'} });
      } 
      else {
        res.status(400).json({ message: { text: 'Username Exist!', type: 'negative'} });
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.verify = (req, res) => {
  console.log(req.protocol+":/"+req.get('host'));
   console.log(req.body)
  if(req.body.key == rand)
  {
    console.log("email is verified");
    res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    orm.SttUser.update(
      { verified: true },
      { where: { username: userDetails.username } }
    )
      .then(result =>
        res.status(200)
      )
      .catch(err =>
        res.status(404).json(err)
      )
  }
  else
  {
    console.log("email is not verified");
    res.end("<h1>Bad Request</h1>");
  }

}

function register(data) {
  var md5_password = crypto.createHash('md5').update(data.password).digest("hex");
  return new Promise((resolve, reject) => {
    orm.SttUser.findAndCountAll({
      where:{[Op.or]: [{username: data.username}, {email: data.email}]}
    }) 
      .then((user) => {
        var success;
        if (user.count > 0) {
          success = false
          console.log('existing user: ', user.count)
        } else {
          orm.SttUser.create({
            username: data.username,
            email: data.email,
            password: md5_password,
            CustomizationId: 0,
            enableVocabulary: 1,
            adToken: null,
            language: data.lang,
            firstname: data.firstname,
            lastname: data.lastname,
            verified: false,
            isGoogleAuth: false
          })
          success = true
        }
        resolve(success)
      }).catch((err) => {
        reject(err)
      })
  })
}