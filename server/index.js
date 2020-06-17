'use strict';

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  router = require('./router'),
  morgan = require('morgan'),
  environment = process.env.NODE_ENV || 'development',
  config = require('./config/main')[environment],
  winston = require('./config/logger'),
  logger = winston.logger(environment),
  jwtVerify = require('./lib/jwtVerify');

// start server
// let server = undefined;
if (environment !== 'test') {
  app.listen(config.port);
} else {
  app.listen;
}

// middlewares
app.use(bodyParser.urlencoded({ extended: true })); // parses urlenconded bodies
app.use(bodyParser.json()); // send JSON reponses
app.use(morgan( (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `body: ${JSON.stringify(req.body)}`,
    `params: ${JSON.stringify(req.params)}`,
    `query: ${JSON.stringify(req.query)}`,
    `headers: ${JSON.stringify(req.headers)}`
  ].join(' ');
}, { stream: winston.stream }));
app.use(jwtVerify);
router(app);

logger.info(`[${environment}] server is running on port ${config.port}`);