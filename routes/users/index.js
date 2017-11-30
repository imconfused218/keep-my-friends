const express = require('express');
const router = express.Router();

const controller = require('./controller');
const authController = require('../auth/controller');

router.post('/', controller.create);
router.use(authController.checkToken);
router.get('/', controller.list);
router.get('/:userId', controller.retrieve);
router.put('/:userId', controller.update);
router.delete('/:userId', controller.destroy);

module.exports = router;
