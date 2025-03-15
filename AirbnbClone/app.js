import express from 'express';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import { Listing } from './models/listings.js'

const app = express();
const port = 8080;

// Setting View Engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Making the path of views static
app.set('views', join(__dirname + '/views'));

// Making the path of public static.
app.use(express.static(join(__dirname, "/public/css")));
app.use(express.static(join(__dirname, "/public/js")));

// Setting up the Server
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});

// Setting up the connection with MongoDB.
const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log('Connected to airbnb database...');
    })
    .catch((err) => {
        console.log(err);
    });

