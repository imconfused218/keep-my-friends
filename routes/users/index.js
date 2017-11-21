const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.list);
router.get('/:userId', controller.retrieve);
router.post('/', controller.create);
router.put('/:userId', controller.update);
router.delete('/:userId', controller.destroy);

module.exports = router;
