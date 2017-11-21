const Sequelize = require('sequelize');
const CONSTANTS = require('./constants');

module.exports = sequelize => {
  const Friend = sequelize.define('friend', {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    strength: {
      type: Sequelize.DECIMAL,
      defaultValue: 100
    },
    decline: {
      type: Sequelize.INTEGER,
      defaultValue: 1
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

  Friend.calculateStrengthLost = (
    declineAugment,
    date,
    lossRate = CONSTANTS.TIME_PER_STRENGTH_LOSS
  ) => (Date.now() - date) / lossRate * declineAugment;

  return Friend;
};
