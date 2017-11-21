const User = require('./user');
const Friend = require('./friend');
const Interaction = require('./interaction');

let models;

module.exports = sequelize => {
  if (models) return models;
  if (!models && !sequelize)
    throw new Error('Must provide sequelize for initial bootstrap.');

  models = {
    User: User(sequelize),
    Friend: Friend(sequelize),
    Interaction: Interaction(sequelize)
  };

  Object.keys(models).forEach(name => {
    models[name].associate && models[name].associate(models);
  });

  return models;
};
