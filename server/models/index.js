'use strict';

const fs    = require('fs'),
  path      = require('path'),
  Sequelize = require('sequelize'),
  env       = process.env.NODE_ENV || 'development',
  config    = require(__dirname + '/../config/config.js')[env],
  basename  = path.basename(__filename);

let db = {},
  sequelize,
  filelist = [];

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
//  https://gist.github.com/kethinov/6658166
const walkSync = function(dir, filelist) {

  if( dir[dir.length-1] != '/') dir=dir.concat('/');
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push({ abs: `${dir}${file}`, name: file });
    }
  });
  return filelist;
	
};

filelist = walkSync(__dirname, filelist);

filelist = filelist.filter( (f) => {
  return (f.name.indexOf('.') !== 0) && (f.name !== basename) && (f.name.slice(-3) === '.js');
});

filelist.forEach(f => {
  var model = sequelize['import'](f.abs);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
