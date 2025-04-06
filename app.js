if (process.env.NODE_ENV != 'production') {
    await import('dotenv/config');
}

import express from 'express';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import { User } from './models/users.js';

import listings from './routes/listings.js';
import reviews from './routes/reviews.js';
import users from './routes/users.js';
import { error } from 'console';

const app = express();
const port = 8080;

// console.log(process.env.CLOUD_NAME);
// console.log(process.env.CLOUD_API_KEY);
// console.log(process.env.CLOUD_API_SECRET);
// console.log(process.env.ATLASDB_URL)

// Setting View Engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Making the path of views static
app.set('views', join(__dirname + '/views'));

// Making the path of public static.
app.use(express.static(join(__dirname, '/public/css')));
app.use(express.static(join(__dirname, '/public/js')));
app.use(express.static(join(__dirname, '/public/assets')));

// Setting up the Server
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});


// Fetching URL for connection with MongoDB.
const MONGO_URL = process.env.MONGO_URL;
const ATLASDB_URL = process.env.ATLASDB_URL;

// Connecting to Local Database
async function main() {
    mongoose.connect(ATLASDB_URL);
}

main()
    .then(() => {
        console.log('Connected to hotelcatalogue database...');
    })
    .catch((err) => {
        console.log(err);
    });

// Using connect-mongo to sessions information on Atlas Database
const store = MongoStore.create({
    mongoUrl: ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on('error', () => {
    console.log('Mongo Session Store is fucked up... :(', error)
});

// Using express-sessions & passing MongoStore object inside express-sessions
const expressSessions = {
    store, 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000), // Passing the time in milliseconds 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(expressSessions));

// Using connect-flash
app.use(flash());

// Implementing Authorization & Authentication
// pbkdf2 Hashing Algorithm is used
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Saving Information in Locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// Root
app.get('/', async (req, res) => {
    res.redirect('/listings');
});

// Route for /listings
app.use('/listings', listings);

// Route for /listings/:id/reviews
app.use('/listings/:id/review', reviews);

// Route for /users
app.use('/users', users);

// Throwing Page Not Fount error for invalid routes
app.all('*', (req, res, next) => {
    // next(new ExpressError(404, 'Page Not Found!!!'));
    res.render('errors/error404.ejs');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = 'Oops! Error Occurred...' } = err;
    console.log(err);
    res.status(status).render('errors/error.ejs', { status, message });
});