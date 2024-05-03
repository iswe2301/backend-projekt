const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar schema för erfarenheter i DB
const experienceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true
    }
});

// Skapar en mongoose-model av schemat med namnet Experience, använder kollektionen "experiences"
const Experience = mongoose.model("Experience", experienceSchema, "experiences");
module.exports = Experience; // Exporterar Experience