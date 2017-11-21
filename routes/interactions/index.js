const express = require('express');
const router = express.Router();

const controller = require('./controller');

//router.get('/', controller.list);
router.get('/:interactionId', controller.retrieve);
router.post('/users/:userId/friends/:friendId', controller.create);
router.put('/:interactionId', controller.update);
router.delete('/:interactionId', controller.destroy);

module.exports = router;
