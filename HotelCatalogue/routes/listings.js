import { Router } from 'express';

import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';

import { Listing } from '../models/listings.js';

import { isLoggedIn, validateListing, isOwner } from '../middleware.js';

const listings = Router();

// View all the Listings
// Index Route
listings.get('/',
    wrapAsync(async (req, res) => {
        let listings = await Listing.find({});
        res.render('listings/index.ejs', { listings });
    })
);

// Create Route
listings.get('/add', isLoggedIn,
    (req, res) => {
        res.render('listings/add.ejs');
    });

// Passing validateListing() as a Middleware for Server-side Schema Validation.
listings.post('/', isLoggedIn, validateListing,
    wrapAsync(async (req, res, next) => {
        // if (!req.body.listing) {
        //     throw new ExpressError(400, 'Send Valid Data...');
        // }

        let listing = req.body.listing;
        listing.owner = req.user._id;
        await new Listing(listing).save();

        req.flash('success', 'New Listing Added... :)');
        res.redirect('/listings');
    })
);

// Edit Route
listings.get('/:id/edit', isLoggedIn, isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            // throw new ExpressError(404, 'Listing Not Found...');
            req.flash('error', 'Listing does not exist... :(');
            res.redirect('listings/');
        }

        res.render('listings/edit.ejs', { listing });
    })
);

// Passing validateListing() as a Middleware for Server-side Schema Validation.
listings.patch('/:id', isLoggedIn, isOwner, validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, 'Listing Not Found...');
        }

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { runValidators: true }
        );

        req.flash('success', 'Listing Updated... :)');
        res.redirect(`/listings/${id}`);
    })
);

// Show Route
listings.get('/:id',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id)
            .populate({path: 'reviews', populate: {path: 'author'}})
            .populate('owner');
        if (!listing) {
            // throw new ExpressError(404, 'Listing Not Found...');
            req.flash('error', 'Listing does not exist... :(');
            res.redirect('/listings');
        } else {
            res.render('listings/view.ejs', { listing });
        }
    })
);

// Destroy Route
listings.delete('/:id', isLoggedIn, isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, 'Listing Not Found...');
        }

        await Listing.findByIdAndDelete(id);

        req.flash('success', 'Listing Deleted... :)');
        res.redirect('/');
    })
);

export default listings;