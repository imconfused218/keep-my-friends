const constants = require('../constants');

const checkToken = token =>
  token.inactive ||
  (!token.keepActive &&
    Date.now() - token.createdAt > constants.TIME_FOR_TOKEN_EXPIRE);

module.exports = { checkToken };
