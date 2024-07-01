const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner,validateListing} = require("../middleware.js");

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
    let listings = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listings) {
        req.flash("error","Listing You Requested does not Exist");
        res.redirect("/listings");
    }
    console.log(listings);
    res.render("listings/show.ejs", { listings });
}));

//Create route
router.post("/", isLoggedin,validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edite",isLoggedin,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error","Listing You Requested does not Exist");
        res.redirect("/listings");
    }
    res.render("listings/edite.ejs", { listings });
}));
//Update Route
router.put("/:id",isLoggedin,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedin,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
}));

module.exports = router;