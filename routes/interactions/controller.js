const Interaction = require('../../models')().Interaction;

const create = (req, res) => {
  const info = Object.assign({}, req.body, {
    userId: req.params.userId,
    friendId: req.params.friendId
  });
  return Interaction.updateStrengthAndCreate(info).then(
    interaction => res.status(200).json(interaction),
    err => res.status(400).json(err)
  );
};

const update = (req, res) =>
  Interaction.findById(req.params.interactionId).then(interaction => {
    !interaction && res.status(404).json({ message: 'Interaction not found' });
    const updatedInteraction = Object.assign({}, interaction, req.body);
    interaction
      .update(updatedInteraction)
      .then(updated => res.json(updated), err => res.status(400).json(err));
  });

const list = (req, res) =>
  Interaction.findAll().then(
    interactions => res.status(200).json(interactions),
    err => res.status(400).json(err)
  );

const destroy = (req, res) =>
  Interaction.findById(req.params.interactionId).then(interaction => {
    if (!interaction)
      return res.status(404).json({ message: 'Interaction not found' });
    interaction
      .destroy()
      .then(() => res.status(204).send(), err => res.status(400).json(err));
  });

const retrieve = (req, res) =>
  Interaction.findById(req.params.interactionId).then(
    interaction => res.status(200).json(interaction),
    err => res.status(400).json(err)
  );

module.exports = {
  list,
  create,
  update,
  destroy,
  retrieve
};
