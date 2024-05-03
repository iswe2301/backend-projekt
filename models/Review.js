const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar ett schema för recensioner till DB
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false // Valfritt att lämna namn
    },
    rating: {
        type: Number,
        required: [true, "Du måste välja en rating"]
    },
    comment: {
        type: String,
        required: false // Valfritt att lämna kommentar
    },
    visitDate: {
        type: Date,
        required: false // Valfritt att lämna datum
    }
});

const Review = mongoose.model("Review", reviewSchema, "reviews"); // Skapar en mongoose-model av schemat med namnet Review, hamnar i collectionen reviews
module.exports = Review; // Exporterar Review