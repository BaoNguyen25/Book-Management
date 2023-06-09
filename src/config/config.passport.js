const passport = require('passport');
const { User } = require('../models/user.model');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         if (err) return done(err);
//         if (!user) return done(null, false);
//         done(null, user);
//     })
// });



module.exports = passport;