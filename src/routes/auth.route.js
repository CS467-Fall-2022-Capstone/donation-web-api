import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import Teacher from '../models/teacher.model.js';


// store authenticated user into session, if session is not timed out, no need to log in again
passport.serializeUser(function (user, next) {
    next(null, user.id);
});

// it will open the session and convert id stored in session into the actual user object, accessible in req.user
passport.deserializeUser(function (id, next) {
    User.findbyId(id, function (err, user) {
        next(err, user);
    });
});

// local strategy
// usernameField and pwField is optional, default is just username and pw. but in this case, we need to redefine to user[email] and user[pw]
passport.use(
    new LocalStrategy(
        {
            usernameField: 'user[email]',
            passwordField: 'user[password]',
            passReqToCallBack: true,
        },
        localVerify
    )
);

// verify callback for local Strategy
function localVerify(req, passportEmail, passportPassword, next) {
    User.findOne({
        email: passportEmail,
    }).exec(function (err, foundUser) {
        if (err) {
            console.log('err', err);
            return next(err);
        } // goes to failureRedirect, which is defined in routes

        if (foundUser.validPassword(passportPassword)) {
            console.log('success, redirect to /profile');
            next(null, foundUser); // goes to successRedirect, which is defined in routes
        }
    });
}

module.exports = passport;