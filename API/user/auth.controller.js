'use strict';

const UserModel = require('../../Models/user.model');
const bcrypt = require('bcrypt');
const { signToken } = require('./auth.service');
const _ = require('lodash');
const logger = require('../../utils/logger');
const { sendFailureResponse } = require('../../utils/common-response');
const { logMagenta } = require('../../utils/colored-log');
const validator = require('validator');

exports.localSignUp = (req, res) => {
    if (!req.body.firstName || !validator.trim(req.body.firstName)) {
        return sendFailureResponse(req, res, 'FirstName is required!');
    }
    if (!req.body.lastName || !validator.trim(req.body.lastName)) {
        return sendFailureResponse(req, res, 'LastName is required!');
    }
    if (!req.body.email || !validator.trim(req.body.email)) {
        return sendFailureResponse(req, res, 'Email is required!');
    }
    if (!validator.isEmail(req.body.email)) {
        return sendFailureResponse(req, res, 'Email is not valid!');
    }
    if (!req.body.contactNumber || !validator.trim(req.body.contactNumber)) {
        return sendFailureResponse(req, res, 'Contact Number is required!');
    }
    if (!validator.isMobilePhone(req.body.contactNumber)) {
        return sendFailureResponse(req, res, 'Contact Number is not valid!');
    }
    if (!req.body.password || !validator.trim(req.body.password)) {
        return sendFailureResponse(req, res, 'Password is required!');
    }
    UserModel.findOne({ contactNumber: req.body.contactNumber })
        .then(user => {
            if (user) {
                return sendFailureResponse(req, res, 'You are already registered. Please use login');
            } else {
                bcrypt.hash(req.body.password, 8)
                    .then(hash => {
                        new UserModel({
                            firstName: validator.trim(req.body.firstName),
                            lastName: validator.trim(req.body.lastName),
                            email: validator.trim(req.body.email),
                            contactNumber: validator.trim(req.body.contactNumber),
                            password: hash,
                        }).save((err, _user) => {
                            if (err) {
                                return sendFailureResponse(req, res, 'Database error. Please try again');
                            } else {
                                if (_user) {
                                    let token = signToken(_user._id, _user.firstName, _user.lastName, _user.email);
                                    return res.json({
                                        success: true,
                                        token: token,
                                        user: {
                                            name: _user.firstName + ' ' + _user.lastName,
                                            email: _user.email,
                                            contactNumber: _user.contactNumber,
                                        },
                                    });
                                } else {
                                    return sendFailureResponse(req, res, 'Couldn\'t create user!');
                                }
                            }
                        });
                    });
            }
        })
        .catch(err => {
            console.error(err);
            return sendFailureResponse(req, res, 'Server error. Please try again');
        });
};

exports.localLogin = (req, res) => {
    if (!req.body.contactNumber || !validator.trim(req.body.contactNumber)) {
        return sendFailureResponse(req, res, 'Contact Number is required!');
    }
    if (!validator.isMobilePhone(validator.trim(req.body.contactNumber))) {
        return sendFailureResponse(req, res, 'Contact Number is not valid!');
    }
    if (!req.body.password || !validator.trim(req.body.password)) {
        return sendFailureResponse(req, res, 'Password is required!');
    }
    UserModel.findOne({ contactNumber: validator.trim(req.body.contactNumber) })
        .then(user => {
            if (!user) {
                return sendFailureResponse(req, res, 'You are not registered with us. Please Sign up!');
            }
            user.authenticate(validator.trim(req.body.password), (authError, authenticated) => {
                if (authError) {
                    console.log(authError);
                    return sendFailureResponse(req, res, 'Please reset password.');
                }
                if (!authenticated)
                    return sendFailureResponse(req, res, 'Wrong Password! Please check and try again!');
                else {
                    let token = signToken(user._id, user.firstName, user.lastName, user.email);
                    return res.json({
                        success: true,
                        message: 'Logged In!',
                        token: token,
                        user: _.pick(user, 'firstName', 'lastName', 'email', 'contactNumber'),
                    });
                }
            });
        })
        .catch(err => {
            console.error(err);
            return sendFailureResponse(req, res, 'Server error. Please try again');
        });
};

exports.getUserData = (req, res) => {
    return res.json({
        success: true,
        message: 'User Found!',
        user: req.user,
    });
};

exports.changePassword = (req, res) => {
    if (!req.body.password || !validator.trim(req.body.password)) {
        return sendFailureResponse(req, res, 'Password is required!');
    }
    bcrypt.hash(validator.trim(req.body.password), 8)
        .then((hash) => {
            UserModel.findOneAndUpdate({
                contactNumber: req.user.contactNumber,
            }, {
                password: hash,
            }, {
                new: true,
                upsert: true,
            })
                .then(_user => {
                    if (_user) {
                        res.json({ success: true, message: 'Password updated!' });
                    } else {
                        sendFailureResponse(req, res, 'Couldn\'t update pasword, try again!');
                    }
                });
        })
        .catch(error => {
            console.error(error);
            return sendFailureResponse(req, res, 'Couldn\'t update pasword, try again!');
        });
};
