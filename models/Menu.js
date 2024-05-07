const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar ett schema för meny till DB
const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du måste ange rättens namn"]
    },
    description: {
        type: String,
        required: false // Falskt då tillbehör/dryck ej behöver beskrivning
    },
    category: {
        type: String,
        required: [true, "Du måste ange rättens kategori"],
        enum: ["starter", "main", "dessert", "sides", "drink",] // Menyns huvudkategorier
    },
    drinkcategory: {
        type: String,
        enum: ["wine", "bubbles", "beer", "non-alcoholic"], // Underkategorier för drycker
        default: null // Default null om inget annat anges
    },
    price: {
        type: Number,
        required: [true, "Du måste ange ett pris på rätten"]
    }
});

const Dish = mongoose.model("Dish", dishSchema, "dishes"); // Skapar en mongoose-model av schemat med namnet Dish, hamnar i collectionen dishes
module.exports = Dish; // Exporterar Dish