const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar ett schema för meny till DB
const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du måste ange rättens namn"]
    },
    description: {
        type: String,
        required: [true, "Du måste ange en beskrivning av rätten"]
    },
    category: {
        type: String,
        required: [true, "Du måste ange rättens kategori"],
        enum: ["starter", "main", "dessert", "drink"] // Menyns huvudkategorier
    },
    drinkcategory: {
        type: String,
        enum: ["wine", "beer", "non-alcoholic"], // Underkategorier för drycker
        default: null
    },
    price: {
        type: Number,
        required: [true, "Du måste ange ett pris på rätten"]
    }
});

const Dish = mongoose.model("Dish", dishSchema, "dishes"); // Skapar en mongoose-model av schemat med namnet Dish, hamnar i collectionen dishes
module.exports = Dish; // Exporterar Dish