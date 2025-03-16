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
app.use(express.static(join(__dirname, '/public/css')));
app.use(express.static(join(__dirname, '/public/js')));
app.use(express.static(join(__dirname, '/public/assets')));

// Setting up the Serve
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

// Root
app.get('/', async (req, res) => {
    res.send("Server working...");
})

// View all the Listings
// Index Route
app.get('/listings', async (req, res) => {
    let listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
});

// Create Route
app.get('/listings/add', (req, res) => {
    res.render('listings/add.ejs');
});

app.post('/listings', async (req, res) => {
    let listing = req.body.listing;
    await new Listing(listing).save();
    res.redirect('/listings');
});

// Show Route
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/view.ejs', { listing });
});

// Edit Route
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});

app.patch('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { runValidators: true }
    );
    res.redirect(`/listings/${id}`);
});

// Destroy Route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});