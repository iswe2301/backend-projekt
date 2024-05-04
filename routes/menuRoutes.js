const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
const Menu = require("../models/Menu"); // Inkluderar modell för meny
const { authenticateToken } = require("../functions/authFunction.js"); // Inkluderar funktion för autentisering

// Skapar en GET-route för att hämta alla rätter i menyn
router.get("/", async (req, res) => {
    try {
        // Hämtar alla rätter i menyn från databasen
        const dishes = await Menu.find({});
        // Kontrollerar om det inte finns några rätter i menyn
        if (dishes.length === 0) {
            // Returnerar felmeddelande med felkod om inga resultat finns
            return res.status(404).json({ message: "Inga rätter i menyn funna" });
        } else {
            // Returnerar meny med rätter
            return res.json(dishes);
        }
    } catch (error) {
        console.error("Fel vid hämtning av menyn: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Route för POST (lägga till en ny rätt i menyn)
router.post("/", authenticateToken, async (req, res) => {
    try {
        // Skapar en ny rätt med datan från request body
        const newDish = new Menu(req.body);
        // Sparar den nya rätten i databasen
        await newDish.save();
        // Loggar att en ny rätt har skapats
        console.log("Ny rätt tillagd i menyn!");
        res.status(201).json({ message: "Ny rätt tillagd i menyn!" }); // Returnerar success-meddelande
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid tilläggning av ny rätt: ", error);
        // Returnerar statuskod tillsammans med felet
        res.status(500).json(error);
    }
});

// Route för PUT (uppdatering av specifik rätt i menyn)
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        // Hämtar ID från url:en
        const id = req.params.id;
        // Hämtar rätten från datan i bodyn
        const data = req.body;
        // Skapar en uppdatering av specifik rätt baserat på id, med datan som hämtats från bodyn
        const updatedDish = await Menu.updateOne({ _id: id }, { $set: data }, { runValidators: true }); // Sätter runValidators till true för att aktivera schemavalidering vid uppdateringen
        // Kontrollerar om det inte finns en matchande post i DB
        if (updatedDish.matchedCount === 0) {
            // Returnerar felmeddelande med felkod om ingen matchande post kunde hittas
            return res.status(404).json({ message: `Ingen rätt i menyn hittades med ID ${id}.` });
        } else {
            // Loggar lyckad uppdatering
            console.log(`Rätt med ID ${id} uppdaterad!`);
            // Returnerar ett meddelande om lyckad uppdatering
            return res.json({ message: "Rätten har uppdaterats!" });
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid uppdatering av rätt i menyn: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Route för DELETE (Borttagning av specifik rätt i menyn)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        // Hämtar ID från url:en
        const id = req.params.id;

        // Försöker radera den specifika rätten baserat på id
        let deletedDish = await Menu.deleteOne({ _id: id });

        // Kontrollerar om rätten raderades
        if (deletedDish.deletedCount === 0) {
            // Returnerar felmeddelande med felkod om radering misslyckades
            return res.status(404).json({ message: `Radering misslyckades, ingen rätt hittades med ID ${id}.` });
        } else {
            // Loggar lyckad radering
            console.log(`Rätt med ID ${id} raderad!`);
            // Returnerar ett meddelande om lyckad radering
            return res.json({ message: "Rätten har raderats!" });
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid radering av rätt i menyn: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Exporterar router objektet så det kan användas av andra delar av applikationen
module.exports = router;