const jwt = require('jsonwebtoken'),
  orm = require('../models'),
  baseUrl = '/v1/api', 
  openRoutes = [ '/ad/auth/login', '/stt/auth/login', '/stt/auth/googleauth', '/stt/auth/signup', '/stt/auth/recover', '/stt/auth/send', '/stt/auth/verify', '/stt/auth/reset', '/stt/auth/setpassword' ];

const checkHeader = (req) => {
  if (!req.headers["authorization"]) {
    throw({code: 401, error: 'Unauthorized: No Header'});
  } else {
    req.token = req.headers["authorization"].replace("Bearer ", "");
  }
};

const verifyToken = (req, next) => {
  try {
    jwt.verify(req.token, process.env.SECRET, function(err, decoded) {
      if (err) {
        throw {code: 402, error: "Unauthorized: signed error" };
      }
      let url = req.originalUrl.replace(baseUrl, '');
      if (url.substring(1,3) === 'ad') {
        req.ad = {};
        req.ad.user = decoded;
      }
      if (url.substring(1,4) === 'stt') {
        req.stt = {};
        req.stt.user = decoded;
      }
      next();
    });
  } catch (err) {
    throw(err);
  }
};

const verifySttUser = (req, res, next) => {
 
  orm.SttUser.findById(req.stt.user.id).then((user) => {
    if (!user) {
      throw({code: 403, error: 'Unauthorized: token Stt User not found'});
    }
    req.stt.user = user;
    next();
  }).catch((err) => {
    let code = err.code ? err.code : 400;
    res.status(code).json(err);
  });
  
};

const verifyAdUser =  (req, res, next)  => {

  if (req.ad.user.onUser) {
    orm.AdUser.findById(req.ad.user.id).then((user) => {
      if (!user) {
        throw({code: 403, error: 'Unauthorized: token AD User not found'});
      }
      req.ad.user = user;
      next();
    }).catch((err) => {
      let code = err.code ? err.code : 400;
      res.status(code).json(err);
    });
  }
  if (req.ad.user.onAccount) {
    orm.AdAccount.findById(req.ad.user.id).then((user) => {
      if (!user) {
        throw({code: 403, error: 'Unauthorized: token AD Account not found'});
      }
      req.ad.user = user;
      next();
    }).catch((err) => {
      let code = err.code ? err.code : 400;
      res.status(code).json(err);
    });
  }

};

module.exports = (req, res, next) => {
  
  try {
    if (!openRoutes.includes(req.originalUrl.replace(baseUrl, ''))) {
      checkHeader(req);
      verifyToken(req, next);
    } else {
      next(); // go to router
    }
  } catch (err) {
    let code = err.code ? err.code : 400;
    res.status(code).json(err);
  }

};

module.exports.verifyAdUser = verifyAdUser;
module.exports.verifySttUser = verifySttUser;