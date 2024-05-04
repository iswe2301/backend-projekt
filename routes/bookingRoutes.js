const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
require("dotenv").config(); // Inkluderar env-fil
const Booking = require("../models/Booking"); // Inkluderar modell för bokningar
const nodemailer = require("nodemailer"); // Inkluderar nodemailer för att kunna skicka bekräftelsemail
const moment = require("moment"); // Inkluderar moment för att formatera datum/tid
const { authenticateToken } = require("../functions/authFunction.js"); // Inkluderar funktion för autentisering

// Skapar en transportör för att kunna skicka e-post
const transporter = nodemailer.createTransport({
    service: "gmail", // Använder gmail
    auth: {
        user: process.env.EMAIL, // epost från env-fil
        pass: process.env.PASS // lösen från env-fil
    }
});

// Route för POST (skapa ny bokning)
router.post("/", async (req, res) => {
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

// Skapar en GET-route som är skyddad av JWT för bokningar
router.get("/", authenticateToken, async (req, res) => {
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

// PUT-route för att bekräfta en bokning (uppdatering)
router.put("/confirm/:id", authenticateToken, async (req, res) => {
    try {
        // Hämtar ID från url:en
        const id = req.params.id;
        // Söker efter den specifika bokningen baserat på ID och uppdaterar confirmed till true, sätter new till true för att returnera det nya dokumentet
        const confirmedBooking = await Booking.findByIdAndUpdate(id, { confirmed: true }, { new: true });
        // Kontrollerar om bokningen existerar
        if (!confirmedBooking) {
            return res.status(404).json({ message: "Bokning inte funnen" }); // Returnerar felkod och felmeddelande om bokningen inte kunde hittas/uppdateras
        }

        const bookingDate = moment(confirmedBooking.date); // Använder moment för att formattera datum
        const formattedDate = bookingDate.format("YYYY-MM-DD HH:mm"); // Definierar format

        // Skriver ett meddelande för bokningsbekräftelsen, formatterar med html + inline css
        const bookingInfo =
        `<h1 style="font-size:18px;">Tack för din bokning, ${confirmedBooking.name}!</h1>
        <p>Din bokning har nu bekräftats. Ditt bord är reserverat för ${confirmedBooking.guests} personer, ${formattedDate}.</p>
        <p>Vi ser fram emot ditt besök!</p>
        
        <p>Hälsningar,<br>
        Restaurang Test</p>`;

        // Sätter e-postmeddelandets inställningar
        const mailOptions = {
            from: '"Restaurang Test" <no-reply@restaurangtest.com>', // Namn på avsändaren
            to: confirmedBooking.email, // Skickar till epostadressen som finns i bokningen
            subject: "Din bokning är bekräftad", // Ämnet på mailet
            html: bookingInfo // Meddelandet, skickas i HTML-format
        };

        // Skickar e-posten
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Fel vid skickande av bekräftelsemail: ", error); // Loggar fel
            } else {
                console.log("Bekräftelsemail skickat: ", info.response); // Loggar success
            }
        });
        res.json({ message: "Bokning bekräftad och bekräftelsemail skickat!" }); // Returnerar success-meddelane bokning bekräftats + skickat epost

        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid bekräftelse av bokning: ", error);
        // Returnerar statuskod tillsammans med felet
        res.status(500).json(error);
    }
});

// Exporterar router objektet så det kan användas av andra delar av applikationen
module.exports = router;