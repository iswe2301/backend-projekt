const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
const Contact = require("../models/Contact"); // Inkluderar modell för meddelanden
const { authenticateToken } = require("../functions/authFunction.js"); // Inkluderar funktion för autentisering

// Route för POST (skicka nytt meddelande)
router.post("/", async (req, res) => {
    try {
        // Skapar nytt meddelande genom att läsa in datan från body
        const newMessage = await Contact.create(req.body);
        // Loggar lyckad tilläggning
        console.log("Meddelande skickat");
        res.status(201).json({ message: "Ditt meddelande har skickats!" }); // Returnerar success-meddelande med statuskod
        // Fångar upp ev. felmeddelanden
    } catch (error) {
        console.error("Fel vid skapande av meddelande: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Skapar en GET-route som är skyddad av JWT för kontaktformulär
router.get("/", authenticateToken, async (req, res) => {
    try {
        // Hämtar alla alla meddelanden från DB
        const messages = await Contact.find({});
        // Kontrollerar om det inte finns några meddelanden
        if (messages.length === 0) {
            // Returnerar felmeddelande med felkod om inga resultat finns
            return res.status(404).json({ message: "Inga meddelanden funna" });
        } else {
            // Returnerar meddelanden
            return res.json(messages);
        }
        // Fångar upp ev. felmeddelanden
    } catch (error) {
        console.error("Fel vid hämtning av meddelanden: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Exporterar router objektet så det kan användas av andra delar av applikationen
module.exports = router;