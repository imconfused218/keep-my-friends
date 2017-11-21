const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.post('/users/:userId', controller.create);
router.get('/:friendId', controller.retrieve);
router.put('/:friendId', controller.update);
router.delete('/:friendId', controller.destroy);

module.exports = router;
