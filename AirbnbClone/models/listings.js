import mongoose from 'mongoose';

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
        type: String,
        set: (v) => v === '' ? 'https://unsplash.com/photos/two-minions-character-figure-on-red-table-tloFnD-7EpI' : v,
        default: 'https://unsplash.com/photos/two-minions-character-figure-on-red-table-tloFnD-7EpI'
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
    }
});

export const Listing = mongoose.model('Listing', listingSchema)