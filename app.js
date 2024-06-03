const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing  = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const { error } = require("console");
const Review = require("./models/reviews.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

//Main Route
app.get("/",(req,res)=>{
    res.send("working");
});
//Validate Listings schema server side error
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(404,errMsg);
    }else{
        next();
    }

}

//Validate review schema server side error
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(404,errMsg);
    }else{
        next();
    }

}

//Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}));

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
}); 


app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listings});
}));

//Create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edite",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/edite.ejs",{listings});
}));
//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//reviews route 
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    res.redirect(`/listings/${listings._id}`);
}));

//delete reviews route
app.delete("/listings/:id/reviews/:reviewid",wrapAsync(async(req,res)=>{
        let {id , reviewid} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
        await Review.findByIdAndDelete(reviewid);
        res.redirect(`/listings/${id}`);
}));

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Wend Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,(req,res)=>{
    console.log("listening on 8080");
});




// app.get("/testListing",async (req,res)=>{
//     let sampleLIsting = new Listing({
//         title:"My New Villa",
//         description:"By The New Beach",
//         price:1200,
//         location:"Goa",
//         country:"India"
//     })
    
//     await sampleLIsting.save();
//     res.send("sample was saved successefully");
// });