module.exports = (db, Sequelize) => {
  let Group = db.define('group', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      defaultValue: "Hello..."
    }
  }, {
    tableName: 'group',
    underscored: true
  });
  Group.association = (models) => {
    Group.belongsTo(models.user, { foreignKey: 'createdBy' });
    Group.hasMany(models.message, { onDelete: 'CASCADE' });
    Group.hasMany(models.userGroupMapping, { onDelete: 'CASCADE' });
    Group.hasMany(models.like, { onDelete: 'CASCADE' });
  }
  return Group;
};