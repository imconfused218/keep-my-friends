const Sequelize = require('sequelize');

const DEFINITION = {
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
};

const CONFIGURATION = {};

// Relationships
const ASSOCIATE = (source, models) => {
  source.belongsTo(models.User, {
    foreignKey: {
      name: 'userId',
      allowNull: false,
      onDelete: 'CASCADE'
    }
  });
};

module.exports = {
  DEFINITION,
  CONFIGURATION,
  ASSOCIATE
};
