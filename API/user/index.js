'use strict';
const express = require('express');
const router = express.Router();

const {
    localLogin,
    localSignUp,
    getUserData,
    changePassword,
} = require('./auth.controller');

const { isAuthenticated } = require('./auth.service');

router.post('/local/signup', localSignUp);
router.post('/local/login', localLogin);
router.post('/local/getUserData', isAuthenticated(), getUserData);
router.post('/local/changePassword', isAuthenticated(), changePassword);

module.exports = router;
