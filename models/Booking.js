const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar ett schema för bokningar till DB
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du måste ange ditt namn"]
    },
    phone: {
        type: String,
        required: [true, "Du måste ange ditt telefonnummer"]
    },
    email: {
        type: String,
        required: [true, "Du måste ange din e-postadress"]
    },
    date: {
        type: Date,
        required: [true, "Du måste ange tid/datum för bokningen"]
    },
    guests: {
        type: Number,
        required: [true, "Du måste ange antal personer"]
    },
    specialRequests: {
        type: String, // Övriga önskemål, valfritt
        required: false
    }
});

const Booking = mongoose.model("Booking", bookingSchema, "bookings");  // Skapar en mongoose-model av schemat med namnet Booking, hamnar i collectionen bookings
module.exports = Booking; // Exporterar Booking