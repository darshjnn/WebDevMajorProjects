import mongoose from 'mongoose';
import { Review } from './reviews.js';

const listingSchema = new mongoose.Schema({
    // id is automatically generated.
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
    },
    price: {
        type: Number,
        min: 0
    },
    location: {
        type: String,
        required: true,
        lowercase: true
    },
    country: {
        type: String,
        required: true,
        lowercase: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

// Propagating delete request of listing to all its reviews also
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

export const Listing = mongoose.model('Listing', listingSchema);