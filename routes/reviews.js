import { Router } from "express";

import { isLoggedIn, validateReview, isAuthor } from "../middleware.js";

import { wrapAsync } from '../utils/wrapAsync.js';

import * as reviewController from '../controllers/reviews.js';

let reviews = Router({ mergeParams: true });

// Post Route for Reviews
reviews.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

// Destroy Route for Reviews
reviews.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviewController.destroy));

export default reviews;