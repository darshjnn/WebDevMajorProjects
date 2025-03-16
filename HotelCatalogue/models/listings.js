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
        set: (v) => v === '' ? 'https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : v,
        default: 'https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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