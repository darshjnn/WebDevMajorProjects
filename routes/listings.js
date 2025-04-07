import { Router } from 'express';
import multer from 'multer';

import { storage } from '../cloudinaryConfig.js';

// import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';

import * as listingController from '../controllers/listings.js';

import { isLoggedIn, isOwner } from '../middleware.js';

const listings = Router();

// Setting up Cloud storage
const upload = multer({ storage });

listings.route('/')
    .get(
        // Index Route
        wrapAsync(listingController.index)
    )
    .post(
        // Post Route for adding a Listing
        isLoggedIn, upload.single('listing[image]'),
        wrapAsync(listingController.createPost)
);

// Create Route
listings.get('/add', isLoggedIn, listingController.create);

listings.route('/:id')
    .get(
        // Show Route
        wrapAsync(listingController.show)
    )
    .patch(
        // Patch Route for Edit Listing
        // Passing validateListing() as a Middleware for Server-side Schema Validation.
        isLoggedIn, isOwner, upload.single('listing[image]'),
        wrapAsync(listingController.editPatch)
    )
    .delete(
        // Destroy Route
        isLoggedIn, isOwner, wrapAsync(listingController.destroy)
    );

// Edit Route
listings.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.edit));

export default listings;