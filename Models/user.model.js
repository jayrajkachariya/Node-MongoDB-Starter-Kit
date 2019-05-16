'use strict';
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String },
    password: { type: String, required: true },
    otp: { type: Number },
}, {
    timestamps: true,
});

UserSchema.methods = {
    authenticate(password, callback) {
        bcrypt.compare(password, this.password)
            .then(res => callback(null, res))
            .catch(err => callback(err, false));
    },
};

module.exports = model('UserModel', UserSchema);
