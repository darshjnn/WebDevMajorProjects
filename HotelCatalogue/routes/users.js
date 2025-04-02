import { Router } from "express";

import { saveRedirectUrl } from "../middleware.js";

import { User } from "../models/users.js";

import passport from "passport";

let users = Router();

// Route for Sign Up
users.get('/signup', async (req, res, next) => {
    res.render('users/signup.ejs');
});

// Post Route
users.post('/signup', async (req, res) => {
    try {
        let user = req.body.users;

        let { name, username, email } = user
        const userInfo = new User({ email, name, username });

        const registeredUser = await User.register(userInfo, user.password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', `Welcome ${name}...`);
            res.redirect('/listings');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/users/signup');
    }
});

// Route for Log In request
users.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

// Post Route for Log In request
users.post('/login', saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }),
    async (req, res) => {
        req.flash('success', 'Welcome Back!!!');
        let redirectUrl = res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
    }
);

// Logout Route
users.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out...');
        res.redirect('/listings');
    });
});

export default users;