"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var db = {};
require('../config/config');


let sequelize = new Sequelize(
  CONFIG.db_name,
  CONFIG.db_user,
  CONFIG.db_password,
  {
    host: CONFIG.db_host,
    dialect: CONFIG.db_dialect,
    port: CONFIG.db_port,
    logging: false,
    define: {
      underscored: true,
    },
    dialectOptions: {
      useUTC: true,
    },
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  }).forEach((file) => {
    var model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[file.slice(0, -3)] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].association) {
    db[modelName].association(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
