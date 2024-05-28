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
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fplant%2Fcoconut-palm&psig=AOvVaw02QfM8WxCKw4_fQwpvkBvl&ust=1715331680879000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPC1l86agIYDFQAAAAAdAAAAABAJ",
        set: (v) => v === "" ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fplant%2Fcoconut-palm&psig=AOvVaw02QfM8WxCKw4_fQwpvkBvl&ust=1715331680879000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPC1l86agIYDFQAAAAAdAAAAABAJ" : v, //termery operator
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;