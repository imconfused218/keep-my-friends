const Friend = require('../../models')().Friend;
const Interaction = require('../../models')().Interaction;

const create = (req, res) => {
  const info = Object.assign({}, req.body, { userId: req.params.userId });
  Friend.create(info).then(
    friend => res.status(200).json(friend),
    err => res.status(400).json(err)
  );
};

const update = (req, res) =>
  Friend.findById(req.params.friendId).then(friend => {
    !friend && res.status(404).json({ message: 'Friend not found' });
    const updatedFriend = Object.assign({}, friend, req.body);
    friend
      .update(updatedFriend)
      .then(updated => res.json(updated), err => res.status(400).json(err));
  });

const list = (req, res) =>
  Friend.findAll().then(
    friends => res.status(200).json(friends),
    err => res.status(400).json(err)
  );

const destroy = (req, res) =>
  Friend.findById(req.params.friendId).then(friend => {
    if (!friend) return res.status(404).json({ message: 'Friend not found' });
    friend
      .destroy()
      .then(() => res.status(204).send(), err => res.status(400).json(err));
  });

const retrieve = (req, res) =>
  Friend.findById(req.params.friendId).then(
    friend => {
      if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
      }

      // Just want values for response
      friend = friend.get({ plain: true });

      const lastDate = friend.interactions.length
        ? friend.interactions[0].createdAt
        : friend.createdAt;

      const strengthLost = Friend.calculateStrengthLost(
        friend.decline,
        lastDate
      );

      friend.strength = Friend.determineStrength(friend.strength, strengthLost);

      return res.status(200).json(friend);
    },
    err => res.status(400).json(err)
  );

module.exports = {
  list,
  create,
  update,
  destroy,
  retrieve
};
