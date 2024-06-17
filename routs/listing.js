const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedin} = require("../middleware.js");
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
router.get("/new",isLoggedin, (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate("reviews");
    if (!listings) {
        req.flash("error","Listing You Requested does not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listings });
}));

//Create route
router.post("/", isLoggedin,validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edite",isLoggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error","Listing You Requested does not Exist");
        res.redirect("/listings");
    }
    res.render("listings/edite.ejs", { listings });
}));
//Update Route
router.put("/:id",isLoggedin, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
}));

module.exports = router;