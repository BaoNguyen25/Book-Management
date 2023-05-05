'use strict'

const mongoose = require('mongoose');
const {Schema, model, Types} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    }, 
    role: {
        type: String,
        enum: ['Admin', 'Accountant', 'Staff', 'User'],
        default: 'Staff'
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    identity: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = model('User', userSchema);

module.exports = {
    userSchema,
    User
}