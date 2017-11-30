const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = sequelize => {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          fields: ['email']
        }
      ],
      hooks: {
        beforeSave: (instance, options) => {
          if (instance.changed('password')) {
            return bcryptjs.genSalt(5).then(
              salt =>
                bcryptjs.hash(instance.password, salt).then(
                  hash => (instance.password = hash),
                  err => {
                    console.log('err', err);
                    Promise.reject(err);
                  }
                ),
              err => {
                console.log('err', err);
                Promise.reject(err);
              }
            );
          }
        }
      }
    }
  );

  User.associate = models => {
    User.hasMany(models.Friend, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'friends'
    });
    User.hasMany(models.Token, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'tokens'
    });
  };

  User.defineScopes = models =>
    User.addScope(
      'defaultScope',
      {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: models.Friend,
            as: 'friends',
            include: [
              {
                model: models.Interaction,
                as: 'interactions'
              }
            ]
          }
        ],
        order: [['friends', 'interactions', 'createdAt', 'DESC']]
      },
      { override: true }
    );

  User.verifyPassword = (password, oldPassword) =>
    bcryptjs.compare(password, oldPassword);

  return User;
};
