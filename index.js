'use strict';

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/google_auth_callback',
        scope: ['email'],
        successRedirect: '/',
        failureRedirect: '/google_auth_failure'
    },
    function (accessToken, refreshToken, profile, done) {

        if (profile._json.domain != process.env.GOOGLE_RESTRICT_DOMAIN) {

            done(null, false, {message: 'Invalid Google domain'});

        }
        else {

            done(null, profile);

        }

    }
));

passport.serializeUser((user, done) => {

    done(null, user);

});

passport.deserializeUser((user, done) => {

    done(null, user);

});

module.exports.middleware = express.Router();

module.exports.middleware.use(passport.initialize());
module.exports.middleware.use(passport.session());


module.exports.middleware.get('/google_auth_failure', (req, res) => res.text('Authentication failed.'));

module.exports.middleware.get('/google_auth_login', passport.authenticate('google'));

module.exports.middleware.get('/google_auth_callback', passport.authenticate('google'), (req, res) => res.redirect('/'));


module.exports.middleware.use(require('connect-ensure-login').ensureLoggedIn('/google_auth_login'));

