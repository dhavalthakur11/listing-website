const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");

//Validate Listings schema server side error
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(404, errMsg);
    } else {
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}));

//New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listings });
}));

//Create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edite", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edite.ejs", { listings });
}));
//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;