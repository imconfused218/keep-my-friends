const Sequelize = require('sequelize');

module.exports = sequelize => {
  const Interaction = sequelize.define('interaction', {
    power: {
      type: Sequelize.INTEGER
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

  return Interaction;
};
