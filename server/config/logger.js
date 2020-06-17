const winston = require("winston");

module.exports.logger = (env) => {
  return new winston.Logger({ 
    transports: [ 
      new(winston.transports.Console)({ level: 'debug', handleExceptions: true, json: false, colorize: true }),
      new(winston.transports.File)({ level: 'info', filename: `${__dirname}/../logs/${env}.log`, colorize: true, timestamp: true, json: false })],
    exitOnError: false
  });
};
module.exports.stream = {
  write: function(message) {
    winston.info(message);
  }
};