const Sequelize = require('sequelize');

module.exports = sequelize => {
  const Interaction = sequelize.define('interaction', {
    power: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    note: {
      type: Sequelize.STRING
    }
  });

  Interaction.associate = models => {
    Interaction.belongsTo(models.Friend, {
      foreignKey: 'friendId',
      onDelete: 'CASCADE'
    });
    Interaction.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  Interaction.updateStrengthAndCreate = info => {
    const Friend = require('./')().Friend;
    return sequelize.transaction(t => {
      return Friend.findById(info.friendId, {
        transaction: t,
        include: [{ model: Interaction, as: 'interactions' }]
      }).then(
        friend => {
          if (!friend) {
            throw new Error('Friend not found. Cancelling transaction..');
          }

          const lastDate = friend.interactions.length
            ? friend.interactions[0].createdAt
            : friend.createdAt;

          const strengthLost = Friend.calculateStrengthLost(
            friend.decline,
            lastDate
          );

          const updatedFriend = Object.assign({}, friend, {
            strength: Friend.determineStrength(
              friend.strength,
              strengthLost,
              info.power
            )
          });

          return friend
            .update(updatedFriend, { transaction: t })
            .then(
              updated => Interaction.create(info, { transaction: t }),
              err => Promise.reject(err)
            );
        },
        err => Promise.reject(err)
      );
    });
  };

  return Interaction;
};
