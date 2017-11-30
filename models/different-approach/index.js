const schema = require('./schema');

Object.assign(schema.CONFIGURATION, require('./hooks'));

module.exports = sequelize => {
  const Token = sequelize.define(schema.DEFINITION, schema.CONFIGURATION);

  Token.associate = schema.ASSOCIATE;
  Token.defineScopes = require('./scopes');

  Object.assign(Token, require('./class-methods'));

  return Token;
};
