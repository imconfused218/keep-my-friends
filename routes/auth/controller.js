const Token = require('../../models')().Token;
const User = require('../../models')().User;
const uuidV4 = require('uuid/v4');

const login = (req, res) => {
  User.findOne({
    attributes: { include: ['password'] },
    where: { email: req.body.email }
  }).then(
    user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      User.verifyPassword(req.body.password, user.password).then(
        isVerified => {
          if (isVerified) {
            // ensure no password
            user = user.get({ plain: true });
            delete user.password;
            Token.create({ userId: user.id, value: uuidV4() }).then(
              token => res.status(200).json({ user, token }),
              err => res.status(400).json(err)
            );
          } else {
            res.status(400).json({ message: 'Invalid credentials' });
          }
        },
        err => {
          console.log('err', err);
          return res.status(400).json(err);
        }
      );
    },
    err => res.status(400).json(err)
  );
};

const logout = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ message: 'Token required for logout' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  Token.findOne({ where: { value: token } }).then(token => {
    if (!token) {
      return res.status(404).json({ message: 'That token does not exist' });
    }
    const updated = Object.assign({}, token, { inactive: true });
    token
      .update(updated)
      .then(
        updatedToken => res.status(200).json(updatedToken),
        err => res.status(400).json(err)
      );
  });
};

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  Token.findOne({ where: { value: token } }).then(
    token => {
      if (!token) {
        return res.status(404).json({ message: 'Token does not exist' });
      }

      if (Token.checkToken(token)) {
        // This could be an unnecessary update since inactive could already be true
        // but not sure if it really matters
        const updated = Object.assign({}, token, { inactive: true });
        token.update(updated).then(updatedToken => {
          return res.status(401).json({ message: 'Token has expired' });
        });
      } else {
        next();
      }
    },
    err => res.status(400).json(err)
  );
};

module.exports = {
  login,
  logout,
  checkToken
};
