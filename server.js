const express = require("express"); // Inkluderar express
require("dotenv").config(); // Inkluderar env-fil
const jwt = require("jsonwebtoken"); // Inkluderar JWT
const cors = require('cors'); // Inkluderar cors
const authRoutes = require("./routes/authRoutes"); // Inkluderar routes
const Menu = require("./models/Menu"); // Inkluderar modell för meny
const Booking = require("./models/Booking"); // Inkluderar modell för bokningar
const Contact = require("./models/Contact"); // Inkluderar modell för kontaktmeddelanden
const Review = require("./models/Review"); // Inkluderar modell för recensioner
const Image = require("./models/Image"); // Inkluderar modell för bilder

const app = express(); // Startar applikationen med express
app.use(express.json()); // Inkluderar middleware till express för att konvertera data till json automatiskt
const port = process.env.PORT || 3000; // Lagrar variabel för port, startar antingen enligt inställningar i env-filen eller på port 3000

app.use(cors()); // Använder cors för att tillåta alla domäner

// Använder exporterade routes
app.use("/api", authRoutes);

// ROUTES

// Skapar en GET-route för att hämta alla rätter i menyn
app.get("/api/dishes", async (req, res) => {
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

// Skapar en GET-route för att hämta alla recensioner
app.get("/api/reviews", async (req, res) => {
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

// Skapar en GET-route för att hämta alla bilder
app.get("/api/images", async (req, res) => {
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


// SKYDDADE ROUTES

// Skapar en GET-route som är skyddad av JWT för bokningar
app.get("/api/bookings", authenticateToken, async (req, res) => {
    try {
        // Hämtar alla alla bokningar från DB
        const bookings = await Booking.find({});
        // Kontrollerar om det inte finns några bokningar i menyn
        if (bookings.length === 0) {
            // Returnerar felmeddelande med felkod om inga resultat finns
            return res.status(404).json({ message: "Inga bokningar funna" });
        } else {
            // Returnerar bokningar
            return res.json(bookings);
        }
        // Fångar upp ev. felmeddelanden
    } catch (error) {
        console.error("Fel vid hämtning av bokningar: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// Skapar en GET-route som är skyddad av JWT för kontaktformulär
app.get("/api/messages", authenticateToken, async (req, res) => {
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

// Funktion för att validera JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; // Hämtar authorization header
    const token = authHeader && authHeader.split(" ")[1]; // Hämtar Token
    // Kontrollerar om token finns
    if (token == null) {
        // Skickar felmeddelande md felkod om token saknas
        res.status(401).json({ message: "Ej behörig - token saknas" })
    }
    // Verifirerar token med nyckel från en-filen
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        // Skcikar felmeddelande med felkod om token är ogiltig
        if (err) {
            return res.status(403).json({ message: "Ogiltig JWT" });
        }
        // Lägger till användarnamnet från token om den är giltig
        req.username = username;
        next(); // Går vidare till nästa route (protected get)
    })
}

// Startar applikationen
app.listen(port, () => {
    console.log(`Server körs på port: ${port}`);
});