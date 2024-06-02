const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;