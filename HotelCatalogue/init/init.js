import mongoose from "mongoose";

import { Listing } from '../models/listings.js';
import { User } from '../models/users.js';

import { listings } from './listingsData.js';

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

// Adding an Owner for all the Listings
const addOwner = async () => {
    await User.deleteMany({});

    // Adding a User, which will act as Owner
    const userInfo = new User(
        { email: 'champaklal@gmail.com', name: 'Champak Lal', username: 'champu' });

    console.log(`\nOwner for pre listed listings: ${userInfo}\n`);
    console.log('Password is: champu');

    await User.register(userInfo, 'champu');
};

await addOwner();

// Initialize Listings Database
const initListingsData = async () => {
    await Listing.deleteMany({});

    // Mapping the Owner to each listing
    let owner = await User.findOne({ 'username': 'champu' });
    let ownerId = owner._id.toString();
    listings.data = listings.data.map((obj) => ({ ...obj, owner: `${ownerId}` }));

    await Listing.insertMany(listings.data);
    console.log("Initialized Database afresh...");
};

await initListingsData();