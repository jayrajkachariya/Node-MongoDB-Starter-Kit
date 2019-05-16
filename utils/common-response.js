'use strict';
const {logRed} = require('../utils/colored-log');

exports.sendFailureResponse = (req, res, message) => {
    logRed(message);
    return res.json({
        success: false,
        message: message
    })
};
