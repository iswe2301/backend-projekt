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

// Route för POST (skicka nytt meddelande)
app.post("/api/messages", async (req, res) => {
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

// Route för POST (skapa ny recension)
app.post("/api/reviews", async (req, res) => {
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


// Route för POST (skapa ny bokning)
app.post("/api/bookings", async (req, res) => {
    try {
        // Skapar ny bokning genom att läsa in datan från body
        const newBooking = await Booking.create(req.body);
        // Loggar lyckad tilläggning
        console.log("Bokning genomförd");
        res.status(201).json({ message: "Din bokning har registrerats!" }); // Returnerar success-meddelande med statuskod
        // Fångar upp ev. felmeddelanden
    } catch (error) {
        console.error("Fel vid skapande av bokning: ", error);
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

// Route för POST (ladda upp ny bild)
app.post("/api/images", authenticateToken, async (req, res) => {
    try {
        // Skapar ny bild genom att läsa in datan från body
        const newImage = await Image.create(req.body);
        // Loggar lyckad tilläggning
        console.log("Bild uppladdad");
        res.status(201).json({ message: "Din bild har laddats upp!" }); // Returnerar success-meddelande med statuskod
        // Fångar upp ev. felmeddelanden
    } catch (error) {
        console.error("Fel vid uppladdning av bild: ", error);
        // Returnerar statuskod tillsammans med felet
        return res.status(500).json(error);
    }
});

// PUT-route för att bekräfta en bokning (uppdatering)
app.put("/api/bookings/confirm/:id", authenticateToken, async (req, res) => {
    try {
        // Hämtar ID från url:en
        const id = req.params.id;
        // Söker efter den specifika bokningen baserat på ID och uppdaterar confirmed till true, sätter new till true för att returnera det nya dokumentet
        const confirmedBooking = await Booking.findByIdAndUpdate(id, { confirmed: true }, { new: true });
        // Kontrollerar om bokningen existerar
        if (!confirmedBooking) {
            return res.status(404).json({ message: "Bokning inte funnen" }); // Returnerar felkod och felmeddelande om bokningen inte kunde hittas/uppdateras
        }
        res.json({ message: "Bokning bekräftad!" }); // Returnerar success-meddelane bokning hittats och bekräftats
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid bekräftelse av bokning: ", error);
        // Returnerar statuskod tillsammans med felet
        res.status(500).json(error);
    }
});

// Route för POST (lägga till en ny rätt i menyn)
app.post("/api/dishes", authenticateToken, async (req, res) => {
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
app.put("/api/dishes/:id", authenticateToken, async (req, res) => {
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
app.delete("/api/dishes/:id", async (req, res) => {
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