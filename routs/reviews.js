const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");


//Validate review schema server side error
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(404, errMsg);
    } else {
        next();
    }
}

//Post review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    res.redirect(`/listings/${listings._id}`);
}));

//delete reviews route
router.delete("/:reviewid", wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;