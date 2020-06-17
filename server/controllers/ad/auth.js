require('dotenv').config();

const orm = require(`${__dirname}'/../../models`),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken');

exports.login = (req, res) => {

  try {
    if (!req.body.username) {
      throw({ code: 401, error: 'username required' });
    }
    if (!req.body.password) {
      throw({ code: 402, error: 'password required' });
    }
    if (!req.body.username && !req.body.password) {
      throw({ code: 403, error: 'password and username are required' });
    }
  } 
  catch (err) {
    res.status(err.code).json(err);
  }

  const fetchUser = () => {
    return orm.AdUser.findAll({
      where: { username: req.body.username},
      raw: true,
      limit: 1
    });
  };
  const fetchAccount = () => {
    return orm.AdAccount.findAll({
      where: { username: req.body.username, active: true },
      raw: true,
      limit: 1
    });
  };

  fetchAccount()
    .then((a) => {
      if (a.length == 0) {
        return { onUser: fetchUser() };
      } else {
        return { onAccount: a };
      }
    })
    .then ((u) => {
      if(u.hasOwnProperty('onAccount') && u.onAccount.length > 0) {
        return { isOnAccount: true, data: u.onAccount };
      } else {
        return u.onUser;
      }
    })
    .then((u) => {
      if (u.isOnAccount)
      { 
        return { onAccount: true, data: u.data.pop() };
      }
      else if(u.length > 0) {
        return { onUser: true, data: u.pop() };
      }else {
        throw({ code: 404, error: 'no record'});
      }
    })
    .then((r) => {
      let u = r.data;
      const password = crypto.createHash('md5').update(req.body.password).digest("hex");
      if (password !== u.password) throw({ code: 405, error: 'match error password' });
      return r;
    })
    .then((r) => {
      let u = r.data;
      const payload = { 
        cid: u.account_id, 
        id: u.id,
        username: u.username,
        onUser: r.onUser,
        onAccount: r.onAccount
      };
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30 days' });
      let data = Object.assign({token: token}, r);
      //console.log(r.data);
      res.json(data);
    })
    .catch((err) => {
      let code = err.code ? err.code : 400;
      res.status(code).json(err);
    });

};