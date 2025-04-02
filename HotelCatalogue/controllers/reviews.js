import { Listing } from '../models/listings.js';
import { Review } from '../models/reviews.js';

// Post Request for Adding Review
export const postReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Owner is not allowed to add review to his/her Listing
    if ((res.locals.currUser) && !(res.locals.currUser._id).equals(listing.owner._id)) {
        let review = new Review(req.body.review);
        review.author = req.user._id;

        listing.reviews.push(review);
        await review.save();
        await listing.save();

        req.flash('success', 'New Review Added... :)');
        res.redirect(`/listings/${id}`);
    } else {
        req.flash('error', 'Owner is not allowed to add review... :)');
        res.redirect(`/listings/${id}`);
    }
};

// Destroy Route
export const destroy = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review Deleted... :)');
    res.redirect(`/listings/${id}`);
};