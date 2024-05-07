module.exports = (db, Sequelize) => {
  let Message = db.define('message', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    tableName: 'message',
    underscored: true
  });
  Message.association = (models) => {
    Message.belongsTo(models.user, { foreignKey: 'sentBy' });
    Message.belongsTo(models.group);
    Message.hasMany(models.like, { onDelete: 'CASCADE' });
  }
  return Message;
};