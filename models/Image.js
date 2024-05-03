const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar ett schema för bilder till DB
const imageSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: [true, "Du måste skicka med en bild"]
    },
    altText: {
        type: String,
        required: [true, "Du måste skicka med en beskrivande alt-text för bilden"] // Obligatoriskt med beskrivning av bilden för alt-text
    },
    uploaded: {
        type: Date,
        default: Date.now // Default aktuellt datum när bilden laddades upp
    }
});

const Image = mongoose.model("Image", imageSchema, "images"); // Skapar en mongoose-model av schemat med namnet Image, hamnar i collectionen images
module.exports = Image; // Exporterar Image