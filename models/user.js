const bcrypt_p = require('bcrypt-promise');
const bcrypt = require('bcrypt');

module.exports = (db, Sequelize) => {
  let User = db.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: Sequelize.STRING,
    userName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: Sequelize.TEXT,
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'user',
    underscored: true
  });
  User.association = (models) => {
    User.hasMany(models.group, { foreignKey: 'createdBy' });
    User.hasMany(models.like, { foreignKey: 'likedBy' });
    User.hasMany(models.message);
    User.hasMany(models.userGroupMapping, { foreignKey: 'createdBy', as: "memberAddedBy" });
    User.hasMany(models.userGroupMapping, { foreignKey: "memberId", as: "memberData" });
  }
  User.beforeSave(async (user, options) => {
    let err;
    if (user.changed('password')) {
      let salt, hash;
      let rounds = Math.floor(Math.random() * 6 + 4);
      [err, salt] = await to(bcrypt.genSalt(rounds));
      if (err) {
        console.log(err.message);
      }
      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) {
        console.log(err.message);
      }
      user.password = hash;
    }
  });
  User.prototype.comparePassword = async function (pw) {
    let err, pass;
    if (!this.password) TE('PWD_NOT_SET');
    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) TE(err.message);
    if (!pass) TE('INVALID_PASSWORD_MSG');
    return this;
  };
  return User;
};