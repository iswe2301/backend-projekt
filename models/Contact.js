const mongoose = require("mongoose"); // Inkluderar mongoose

// Skapar ett schema för kontaktformulär till DB
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Du måste ange ditt namn"]
    },
    email: {
        type: String,
        required: [true, "Du måste ange din e-postadress"]
    },
    phone: {
        type: String,
        required: false // Frivilligt med telefonnummer
    },
    message: {
        type: String,
        required: [true, "Du måste skicka med ett meddelande"]
    },
    recieved: {
        type: Date,
        default: Date.now // Aktuellt datum som standard
    }
});

const Contact = mongoose.model("Contact", contactSchema, "messages");  // Skapar en mongoose-model av schemat med namnet Contact, hamnar i collectionen messages
module.exports = Contact; // Exporterar Contact
