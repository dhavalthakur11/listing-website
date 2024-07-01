const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const reviews = require("./reviews.js");
const { ref } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0y78kq1YMuQ_QBV6Eo_osE4CeGnN1Z_6Aag&s",
        set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0y78kq1YMuQ_QBV6Eo_osE4CeGnN1Z_6Aag&s" : v, //termery operator
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
    {
        type: Schema.Types.ObjectId,
        ref:"Review",
    }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;