const Sequelize = require('sequelize');

module.exports = sequelize => {
  const Friend = sequelize.define('friend', {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    strength: {
      type: Sequelize.DECIMAL
    },
    decline: {
      type: Sequelize.INTEGER
    }
  });

  Friend.associate = models => {
    Friend.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Friend.hasMany(models.Interaction, {
      foreignKey: {
        name: 'friendId',
        allowNull: false
      },
      as: 'interactions'
    });
  };

  return Friend;
};
