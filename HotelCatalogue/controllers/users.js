import { User } from "../models/users.js";

// Sign up
export const signUp = async (req, res, next) => {
    res.render('users/signup.ejs');
};

// Post Route
export const userPost = async (req, res) => {
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
};

// Log in Route
export const login = (req, res) => {
    res.render('users/login.ejs');
};

// Post Route for Login
export const loginPost = async (req, res) => {
    req.flash('success', 'Welcome Back!!!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

// Logout Route
export const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out...');
        res.redirect('/listings');
    });
};