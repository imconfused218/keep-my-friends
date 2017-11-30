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
      defaultValue: 100,
      validate: {
        min: 0,
        max: 100
      }
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

  Friend.defineScopes = models => {
    Friend.addScope(
      'defaultScope',
      {
        include: [
          {
            model: models.Interaction,
            as: 'interactions'
          }
        ]
      },
      { override: true }
    );
  };

  Friend.calculateStrengthLost = (
    declineAugment,
    date,
    lossRate = CONSTANTS.TIME_PER_STRENGTH_LOSS
  ) => (Date.now() - date) / lossRate * declineAugment;

  Friend.determineStrength = (oldStrength, strengthLost, power = 0) => {
    const strength =
      parseInt(power, 10) + parseInt(oldStrength, 10) - strengthLost;
    return strength > 100 ? 100 : strength < 0 ? 0 : Math.floor(strength);
  };

  return Friend;
};
