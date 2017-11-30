const Sequelize = require('sequelize');
const constants = require('./constants');

module.exports = sequelize => {
  const Token = sequelize.define('token', {
    value: {
      type: Sequelize.STRING,
      allowNull: false
    },
    inactive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    keepActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  Token.associate = models => {
    Token.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
        onDelete: 'CASCADE'
      }
    });
  };

  Token.checkToken = token =>
    token.inactive ||
    (!token.keepActive &&
      Date.now() - token.createdAt > constants.TIME_FOR_TOKEN_EXPIRE);

  return Token;
};
