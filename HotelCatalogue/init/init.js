import mongoose from "mongoose";
import { Listing } from '../models/listings.js';
import {listings} from './listingsData.js';

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

// Initialize Database
const initListingsData = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(listings.data);
    console.log("Initialized Database afresh...")
};

initListingsData();