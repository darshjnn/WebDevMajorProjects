import { Router } from "express";

import * as userController from '../controllers/users.js';

import { saveRedirectUrl } from "../middleware.js";

import passport from "passport";

let users = Router();

users.route('/signup')
    .get(
        // Route for Sign Up
        userController.signUp
    )
    .post(
        // Post Route
        userController.userPost
    );

users.route('/login')
    .get(
        // Route for Log In request
        userController.login
    )
    .post(
        // Post Route for Log In request
        saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }),
        userController.loginPost
    );

// Logout Route
users.get('/logout', userController.logout);

export default users;