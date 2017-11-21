const Sequelize = require('sequelize');

module.exports = sequelize => {
  const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.Friend, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'friends'
    });
  };

  return User;
};
