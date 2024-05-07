module.exports = (db, Sequelize) => {
  let UserGroupMapping = db.define('userGroupMapping', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, {
    tableName: 'userGroupMapping',
    underscored: true
  });
  UserGroupMapping.association = (models) => {
    UserGroupMapping.belongsTo(models.group);
    UserGroupMapping.belongsTo(models.user, { foreignKey: 'createdBy', as: "memberAddedBy" });
    UserGroupMapping.belongsTo(models.user, { foreignKey: "memberId", as: "memberData" });
  }
  return UserGroupMapping;
};