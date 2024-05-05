const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
const Contact = require("../models/Contact"); // Inkluderar modell för meddelanden
const { authenticateToken } = require("../functions/authFunction.js"); // Inkluderar funktion för autentisering
const nodemailer = require("nodemailer"); // Inkluderar nodemailer för att kunna skicka bekräftelsemail

// Skapar en transportör för att kunna skicka e-post
const transporter = nodemailer.createTransport({
    service: "gmail", // Använder gmail
    auth: {
        user: process.env.EMAIL, // epost från env-fil
        pass: process.env.PASS // lösen från env-fil
    }
});

// Route för POST (skicka nytt meddelande)
router.post("/", async (req, res) => {
    try {
        // Skapar nytt meddelande genom att läsa in datan från body
        const newMessage = await Contact.create(req.body);

        // Skapar e-postmeddelandets innehåll för bekräftelsen
        const emailInfo =
        `<h1 style="font-size:18px;">Tack för ditt meddelande, ${newMessage.name}!</h1>
        <p>Vi har tagit emot ditt meddelande och kommer att återkomma till dig inom 24 timmar.</p>
        <p>Om ditt ärende är brådskande ber vi dig att kontakta oss per telefon, du når oss på <a href="tel:010-1234567">010-123 45 67</a>.</p>
        <p><strong>Ditt meddelande:</strong></p>
        <p><em>"${newMessage.message}"</em></p>

        <p>Hälsningar,<br> 
        Restaurang MÅ.</p>`;

        // Sätter e-postmeddelandets inställningar
        const mailOptions = {
            from: '"Restaurang MÅ." <no-reply@restaurangtest.com>', // Namn på avsändaren
            to: newMessage.email, // Skickar till epostadressen som finns i bokningen
            subject: "Ditt meddelande har registrerats", // Ämnet på mailet
            html: emailInfo // Meddelandet, skickas i HTML-format
        };

        // Skickar e-posten
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Fel vid skickande av e-postbekräftelse: ", error); // Loggar fel
            } else {
                console.log("E-postbekräftelse skickat: ", info.response); // Loggar success
            }
        });

        // Loggar lyckad tilläggning
        console.log("Meddelande skickat");
        res.status(201).json({ message: "Ditt meddelande har skickats! En bekräftelse har skickats till din e-postadress." }); // Returnerar success-meddelande med statuskod
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