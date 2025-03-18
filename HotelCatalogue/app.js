import express from 'express';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import { Listing } from './models/listings.js';
import { wrapAsync } from './utils/wrapAsync.js';
import { ExpressError } from './utils/ExpressError.js';
import { listingSchemaValidate } from './schema.js';

const app = express();
const port = 8080;

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

// Setting up the Serve
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});

// Setting up the connection with MongoDB.
const MONGO_URL = 'mongodb://127.0.0.1:27017/hotelcatalogue';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log('Connected to hotelcatalogue database...');
    })
    .catch((err) => {
        console.log(err);
    });


// Function for Implementing Joi for Server-side Schema Validation.
const validateListing = (req, res, next) => {
    let result = listingSchemaValidate.validate(req.body);
    console.log(result);
    let { error } = result;

    if (error) {
        let errorMsg = error.details.map((e) => e.message).join(', ');
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
}

// Root
app.get('/', async (req, res) => {
    res.redirect('/listings');
})

// View all the Listings
// Index Route
app.get('/listings',
    wrapAsync(async (req, res) => {
        let listings = await Listing.find({});
        res.render('listings/index.ejs', { listings });
    })
);

// Create Route
app.get('/listings/add',
    wrapAsync((req, res) => {
        res.render('listings/add.ejs');
    })
);

// Passing validateListing() as a Middleware for Server-side Schema Validation.
app.post('/listings', validateListing,
    wrapAsync(async (req, res, next) => {
        // if (!req.body.listing) {
        //     throw new ExpressError(400, 'Send Valid Data...');
        // }

        let listing = req.body.listing;
        await new Listing(listing).save();
        res.redirect('/listings');
    })
);

// Show Route
app.get('/listings/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError(404, 'Listing Not Found...');
        }

        res.render('listings/view.ejs', { listing });
    })
);

// Edit Route
app.get('/listings/:id/edit',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, 'Listing Not Found...');
        }

        res.render('listings/edit.ejs', { listing });
    })
);

// Passing validateListing() as a Middleware for Server-side Schema Validation.
app.patch('/listings/:id', validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        // Implementing Joi for Server-side Schema Validation.
        let result = listingSchemaValidate.validate(req.body);
        console.log(result);
        if (result.error) {
            throw new ExpressError(400, 'Send Valid Data...');
        }

        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, 'Listing Not Found...');
        }

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { runValidators: true }
        );
        res.redirect(`/listings/${id}`);
    })
);

// Destroy Route
app.delete('/listings/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, 'Listing Not Found...');
        }

        await Listing.findByIdAndDelete(id);
        res.redirect('/listings');
    })
);

// Throwing Page Not Fount error for invalid routes
app.all('*', (req, res, next) => {
    // next(new ExpressError(404, 'Page Not Found!!!'));
    res.render('errors/error404.ejs');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = 'Oops! Error Occurred...' } = err;
    // console.log(err);
    res.status(status).render('errors/error.ejs', { status, message });
});