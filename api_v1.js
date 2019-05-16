const express = require('express');

const router = express.Router();

router.use('/user', require('./API/user'));

module.exports = router;
