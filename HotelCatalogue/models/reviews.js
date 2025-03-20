import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

export const Review = mongoose.model('Review', reviewSchema);