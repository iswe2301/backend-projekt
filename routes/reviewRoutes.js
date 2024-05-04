const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
const Review = require("../models/Review"); // Inkluderar modell för recensioner

// Skapar en GET-route för att hämta alla recensioner
router.get("/", async (req, res) => {
    try {
        // Hämtar alla recensioner från databasen
        const reviews = await Review.find({});
        // Kontrollerar om det inte finns några recensioner
        if (reviews.length === 0) {
            // Returnerar felmeddelande med felkod om inga resultat finns
            return res.status(404).json({ message: "Inga recensioner funna" });
        } else {
            // Returnerar recensioner
            return res.json(reviews);
        }
    } catch (error) {
        console.error("Fel vid hämtning av recensioner: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Route för POST (skapa ny recension)
router.post("/", async (req, res) => {
    try {
        // Skapar ny recension genom att läsa in datan från body
        const newReview = await Review.create(req.body);
        // Loggar lyckad tilläggning
        console.log("Recension skapad");
        res.status(201).json({ message: "Din recension har skapats!" }); // Returnerar success-meddelande med statuskod
        // Fångar upp ev. felmeddelanden
    } catch (error) {
        console.error("Fel vid skapande av recension: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Exporterar router objektet så det kan användas av andra delar av applikationen
module.exports = router;