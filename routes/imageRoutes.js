const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
const Image = require("../models/Image"); // Inkluderar modell för bilder
const fileUpload = require("express-fileupload"); // Inkluderar fileupload för att hantera filuppladdning
const path = require("path"); // Inkluderar path för att hantera filnamn säkert
const { authenticateToken } = require("../functions/authFunction.js"); // Inkluderar funktion för autentisering

router.use(fileUpload()); // Använder fileupload

// Skapar en GET-route för att hämta bilder
router.get("/", async (req, res) => {
    try {
        // Hämtar alla bilder från databasen
        const images = await Image.find({});
        // Kontrollerar om det inte finns några bilder
        if (images.length === 0) {
            // Returnerar felmeddelande med felkod om inga resultat finns
            return res.status(404).json({ message: "Inga bilder funna" });
        } else {
            // Returnerar bilder
            return res.json(images);
        }
    } catch (error) {
        console.error("Fel vid hämtning av bilder: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Route för PUT (uppdatera befintlig bild)
router.put("/", authenticateToken, async (req, res) => {
    try {
        // Kontrollerar om bilden laddats upp
        if (!req.files || !req.files.bgImage) {
            // Returnerar felkod och felmeddelande om bild saknas
            return res.status(400).json({ message: "Ingen bild laddades upp" });
        }

        const fileType = (await import("file-type")).default; // Importerar file-type för att kontrollera mime-typer

        // Hämtar den uppladdade filen
        const image = req.files.bgImage;
        const imageType = await fileType.fileTypeFromBuffer(image.data); // Använder file-type för att kontrollera MIME-typen

        // Deklarerar variabel i en array för tillåtna MIME-typer, endast JPEG
        const allowedTypes = ["image/jpeg"];

        // Kontrollerar om MIME-typen är tillåten
        if (!allowedTypes.includes(imageType.mime)) {
            // Returnerar felkod och felmeddelande om filtypen är av fel format
            return res.status(400).json({ message: "Endast JPG-filer är tillåtna" });
        }

        // Definierar sökvägen där filen ska sparas, hårdkodar filnamnet för att ersätta befintlig bild
        const uploadPath = path.join(__dirname, "public/images", "background.jpg");

        // Använder mv() för att flytta filen till rätt katalog
        image.mv(uploadPath, async (err) => {
            if (err) {
                // Returnerar fel + felkod om error uppstår
                return res.status(500).json({ message: "Fel vid filöverföring", err });
            }

            try {
                // Hämtar alt-text från bodyn, sätter alternativ alt.text när den saknas
                const altText = req.body.altText || "Bakgrundsbild";
                // Uppdaterar bilden i databasen
                const updatedImage = await Image.updateOne({ imagePath: uploadPath }, { $set: { altText: altText } }, { runValidators: true }); // Sätter runValidators till true för att aktivera schemavalidering vid uppdateringen
                // Kontrollerar om uppdateringen har lyckats
                if (updatedImage.matchedCount === 0) {
                    // Returnerar felmeddelande om uppdatringen inte skett
                    return res.status(404).json({ message: "Ingen bild hittades med den angivna sökvägen." });
                }
                // Skriver ut success-meddelande till konsollen
                console.log("Bilden har uppdaterats");
                // Returnerar successmeddelande till klienten
                return res.json({ message: "Bilden har uppdaterats!" });
                // Fångar ev. fel
            } catch (error) {
                console.error("Fel vid uppdatering av bild: ", error);
                res.status(500).json(error);
            }
        });
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid uppladdning av bild: ", error);
        res.status(500).json(error);
    }
});

// Exporterar router objektet så det kan användas av andra delar av applikationen
module.exports = router;