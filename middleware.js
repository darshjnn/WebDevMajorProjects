import { Listing } from './models/listings.js';
import { Review } from './models/reviews.js';

import { ExpressError } from './utils/ExpressError.js';

import { reviewsSchemaValidate } from './schema.js';

// Checking if any User is Logged in
export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'Please Login or Signup...');
        return res.redirect('/users/login');
    };
    next();
}

// Saving Redirect Url for continuing to the same page before logged in
export const saveRedirectUrl = (req, res, next) => {
    if (req.originalUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
}

// Implementing Joi for Server-side Review Schema Validation.
export const validateReview = (req, res, next) => {
    let result = reviewsSchemaValidate.validate(req.body);
    console.log(result);
    let { error } = result;

    if (error) {
        let errorMsg = error.details.map((e) => e.message).join(', ');
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
}

// Checking if current user is the owner of the listing
export const isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if ((res.locals.currUser) && !(res.locals.currUser._id).equals(listing.owner._id)) {
        req.flash('error', 'Permission Denied! You are not the owner for the listing...');
        return res.redirect(`/listings/${id}`);
    };
    next();
}

// Checking if current user is the author of the review
export const isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if ((res.locals.currUser) && !(res.locals.currUser._id).equals(review.author)) {
        req.flash('error', 'Permission Denied! You are not the author of this review...');
        return res.redirect(`/listings/${id}`);
    }
    next();
}