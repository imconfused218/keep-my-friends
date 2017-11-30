const express = require('express');
const router = express.Router();
const authController = require('./auth/controller');

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use(authController.checkToken);
router.use('/friends', require('./friends'));
router.use('/interactions', require('./interactions'));

module.exports = router;
