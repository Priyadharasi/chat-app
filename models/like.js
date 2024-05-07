module.exports = (db, Sequelize) => {
  let Like = db.define('like', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, {
    tableName: 'like',
    underscored: true
  });
  Like.association = (models) => {
    Like.belongsTo(models.user, { foreignKey: 'likedBy' });
    Like.belongsTo(models.message);
    Like.belongsTo(models.group);
  }
  return Like;
};