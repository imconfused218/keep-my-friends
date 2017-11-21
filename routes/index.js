const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/friends', require('./friends'));
router.use('/interactions', require('./interactions'));

module.exports = router;
