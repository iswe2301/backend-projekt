const express = require("express"); // Inkluderar express
const router = express.Router(); // Skapar ett nytt router-objekt
const jwt = require("jsonwebtoken"); // Inkluderar JWT
const User = require("../models/User"); // Inkluderar användarmodell
require("dotenv").config(); // Inkluderar dotenv-fil

// Skapar en POST-route för att registrera en ny användare
router.post("/register", async (req, res) => {
    try {
        // Hämtar användarnamn och lösenord från bodyn
        const { username, password } = req.body;
        // Kontrollerar om både användarnamn och lösenord har skickats
        if (!username || !password) {
            // Returnerar felmeddelande med felkod om något saknas
            return res.status(400).json({ error: "Ogiltig input, ange användarnamn och lösenord" })
        }
        // Kontrollerar om användaren redan existerar, söker i User-modellen
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            // Returnera felmeddelande med felkod om användaren redan finns
            return res.status(409).json({ error: "Användarnamnet är upptaget" });
        }
        // Skapar en ny användarinstans om input är korrekt och användarnamnet är unikt
        const user = new User({ username, password });
        // Sparar användaren i DB
        await user.save();
        res.status(201).json({ message: "Användare skapad" }); // Skickar success-meddelande om lyckad tilläggning
    } catch (error) {
        res.status(500).json({ error: "Server error" }); // Fångar upp ev. fel och skickar meddelande om det uppstår
    }
});

// Skapar POST-route för att logga in en användare
router.post("/login", async (req, res) => {
    try {
        // Hämtar användarnamn och lösenord från bodyn
        const { username, password } = req.body;
        // Kontrollerar om både användarnamn och lösen har skickats med
        if (!username || !password) {
            // Returnerar felmeddelande med felkod om något saknas
            return res.status(400).json({ error: "Ogiltig input, ange användarnamn och lösenord" })
        }
        // Kontrollerar om användaren existerar
        const user = await User.findOne({ username });
        if (!user) {
            // Returnerar felmeddelande om användaren inte kunde hittas
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord" });
        }
        // Kontrollerar lösenord i User-modellen genom att jämföra inskickat lösenord med hashat lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            // Returnerar felmeddelane om lösenordet intr stämmer överrens
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord" });
        } else {
            // Skapar en JWT om användaren existerar och lösenord stämmer
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            // Skapar ett svarsobjekt som inkluderar meddelande och själva token
            const response = {
                message: "Användare inloggad!",
                token: token
            }
            // Skickar svaret till klienten med meddelandet och token
            res.status(200).json({ response });
        }
    } catch (error) {
        // Fångar upp ev. fel
        res.status(500).json({ error: "Server error" });
    }
});

// Exporterar router objektet så det kan användas av andra delar av applikationen
module.exports = router;