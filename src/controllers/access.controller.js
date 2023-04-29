'use strict';

const { signIn, sendRecoveryEmail, recoverPassword } = require('../services/access.service');

class AccessController {
    signIn = async (req, res, next) => {
        const { email, password } = req.body;

        if (req.isAuthenticated()) {
            return res.status(400).json({
                message: 'You are already logged in',
            });
        }

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email or password is missing',
            });
        }

        const user = await signIn(req, res, next);
        
        return user ? res.status(200).json({
            message: 'Sign in successfully',
            metadata: {
                email: req.user.email,
                role: req.user.role,
            },
        }) : res.status(400).json({'message': 'Invalid email or password'});
    }

    signOut = async (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return res.status(400).json({
                    message: 'Sign out failed',
                });
            }

           res.redirect('/');
        });
    }

    sendRecoveryEmail = async (req, res, next) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const sentMail = await sendRecoveryEmail(email);

        sentMail ? res.status(200).json({
            message: 'Email sent successfully'
        }) : res.status(400).json({
            message: 'Email not found'
        });
    }

    recoverPassword = async (req, res, next) => {
        const {token, password } = req.body;
        const userId = req.params.id;

        if (!token || !password) {
            console.log(token, ' ', password)
            return res.status(400).json({
                message: 'Token or password is missing'
            });
        }

        const recovery = recoverPassword(userId, token, password);

        recovery.then((data) => {
            return data ? res.status(200).json({
                message: 'Password changed successfully'
            }) : res.status(400).json({
                message: 'Invalid email, token or password'
            });
    
        })
    }
};

module.exports = new AccessController();