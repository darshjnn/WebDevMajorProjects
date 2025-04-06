import { Listing } from '../models/listings.js';
import { ExpressError } from '../utils/ExpressError.js';

// Index Route
export const index = async (req, res) => {
    let listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
};

// Create Route
export const create = (req, res) => {
    res.render('listings/add.ejs');
};

// Post Request for Create Route
export const createPost = async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, 'Send Valid Data...');
    }

    let listing = req.body.listing;
    listing.owner = req.user._id;

    // Fetching Listing Image URL
    if (typeof req.file === 'undefined') {
        throw new ExpressError(400, 'Upload a Valid Image...');
    }
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };

    await new Listing(listing).save();

    req.flash('success', 'New Listing Added... :)');
    res.redirect('/listings');

};

// Edit Route
export const edit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        // throw new ExpressError(404, 'Listing Not Found...');
        req.flash('error', 'Listing does not exist... :(');
        res.redirect('listings/');
    }

    // Reducing the Image quality to avoid overhead of loading high-quality images
    let optimizedImg = listing.image.url.replace('/upload', '/upload/h_250');

    res.render('listings/edit.ejs', { listing, optimizedImg });
};

// Patch Request for Edit Route
export const editPatch = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, 'Listing Not Found...');
    }

    await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { runValidators: true }
    );

    // Fetching Listing Image URL
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };

        await new Listing(listing).save();
    }

    req.flash('success', 'Listing Updated... :)');
    res.redirect(`/listings/${id}`);
};

// Show Route
export const show = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    if (!listing) {
        // throw new ExpressError(404, 'Listing Not Found...');
        req.flash('error', 'Listing does not exist... :(');
        res.redirect('/listings');
    } else {
        res.render('listings/view.ejs', { listing });
    }
};

// Destroy Route
export const destroy = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, 'Listing Not Found...');
    }

    await Listing.findByIdAndDelete(id);

    req.flash('success', 'Listing Deleted... :)');
    res.redirect('/');
};