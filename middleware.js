const Listing = require("./models/listing");
const { listingSchema,reviewSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be loged in to create listings");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Validate Listings schema server side error
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(404, errMsg);
    } else {
        next();
    }
}

//Validate review schema server side error
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(404, errMsg);
    } else {
        next();
    }
}
