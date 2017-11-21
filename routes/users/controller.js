const User = require('../../models')().User;
const Friend = require('../../models')().Friend;
const Interaction = require('../../models')().Interaction;

const create = (req, res) =>
  User.create(req.body).then(
    user => res.status(200).json(user),
    err => res.status(400).json(err)
  );

const update = (req, res) =>
  User.findById(req.params.userId).then(user => {
    !user && res.status(404).json({ message: 'User not found' });
    const updatedUser = Object.assign({}, user, req.body);
    user
      .update(updatedUser)
      .then(updated => res.json(updated), err => res.status(400).json(err));
  });

const list = (req, res) =>
  User.findAll().then(
    users => res.status(200).json(users),
    err => res.status(400).json(err)
  );

const destroy = (req, res) =>
  User.findById(req.params.userId).then(user => {
    if (!user) return res.status(404).json({ message: 'User not found' });
    user
      .destroy()
      .then(() => res.status(204).send(), err => res.status(400).json(err));
  });

const retrieve = (req, res) => {
  User.findById(req.params.userId, {
    include: [
      {
        model: Friend,
        as: 'friends',
        include: [{ model: Interaction, as: 'interactions' }]
      }
    ]
  }).then(
    user => {
      user.friends = user.friends.map(friend => {
        const lastDate = friend.interactions.length
          ? friend.interactions[0].createdAt
          : friend.createdAt;
        friend.dataValues['strengthLost'] = Friend.calculateStrengthLost(
          friend.decline,
          lastDate
        );
        return friend;
      });
      res.status(200).json(user);
    },
    err => res.status(400).send(err)
  );
};

module.exports = {
  list,
  create,
  update,
  destroy,
  retrieve
};
