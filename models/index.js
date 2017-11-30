const User = require('./user');
const Friend = require('./friend');
const Interaction = require('./interaction');
const Token = require('./token');

let models;

module.exports = sequelize => {
  if (models) return models;
  if (!models && !sequelize)
    throw new Error('Must provide sequelize for initial bootstrap.');

  // Initialize models
  models = {
    User: User(sequelize),
    Friend: Friend(sequelize),
    Interaction: Interaction(sequelize),
    Token: Token(sequelize)
  };

  // Establish relationships
  Object.keys(models).forEach(name => {
    models[name].associate && models[name].associate(models);
  });

  // Initialize scopes
  Object.keys(models).forEach(name => {
    models[name].defineScopes && models[name].defineScopes(models);
  });

  return models;
};
