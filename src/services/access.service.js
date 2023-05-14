"use strict";

const { User } = require('../models/user.model');
const { Recovery } = require('../models/recovery.model');
const passport = require('../config/config.passport');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');
const { app } = require('../config/config.app');

class AccessService {
    static signIn = async (req, res, next) => {
        const { email, password } = req.body;
        return new Promise(async (resolve, reject) => {
            const user = new User({
                email,
                password
            })

            await passport.authenticate('local', async (err, user, info) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
            
                if (!user) {
                    return reject(info.message);
                }

                //check role user
                if (user.role === 'User') {
                    return reject('You do not have permission to access this page');
                }
            
                await req.logIn(user, (err) => {
                    if (err) {
                    console.error(err);
                    return reject(err);
                    }
            
                    return resolve(user);
                });
            })(req, res, next);
        }).catch(err => {
            console.error(err);
            return null;
        });
    };

    static sendRecoveryEmail = async (email) => {
        const user = await User.findOne({email: email});

        if (!user) {
            return null;
        }

        const genToken = crypto.randomBytes(4).toString('hex');

        const info = {
            userId: user._id,
            email: user.email,
            token: genToken
        }

        await Recovery.findOneAndDelete({email: email})
            .catch(err => {
                console.error(err);
                return null;
            });


        await Recovery.create(info)
            .catch(err => {
                console.error(err);
                return null;
            });

        const to = email;
        const subject = `Recover your password for Book Management service`;
        const htmlContent = `
            <h1>Book Management</h1>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password for your Book Management account.</p>
            <p>Use the following password reset token to reset the password for your Book Management account.</p>
            <p><b>${genToken}</b></p>
            <p>Token is only valid for 15 minutes, please make sure you recovery it before it expires</p>
            <p>Please visit ${app.url}/access/reset-password/${user._id} to reset your password</p>
            <p>Thanks,</p>
            <p>Book Management Team</p>
        `;

        const sentMail = await sendMail(to, subject, htmlContent);
        return sentMail ? sentMail : null;
    };

    static recoverPassword = async (userId, token, password) => {
        const recoveryInfo = await Recovery.findOne({userId: userId, token: token});

        if (!recoveryInfo) {
            return null;
        }

        const now = Date.now();

        if (now > recoveryInfo.expireAt) {
            return null;
        }

        if (recoveryInfo.token !== token) {
            return null;
        }

        const user = await User.findOne({_id: userId})
            .catch(err => {
                console.error(err);
                return null;
            });
        
        await user.setPassword(password, async (err, user) => {
            if (err) {
                console.error(err);
                return null;
            }

            await user.save();
        });

        if (user) {
            await Recovery.findOneAndDelete({userId: userId})
                .catch(err => {
                    console.error(err);
                    return null;
                });
        }

        return user ? user : null;
    }
}

module.exports = AccessService;