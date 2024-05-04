const jwt = require("jsonwebtoken"); // Inkluderar JWT

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

module.exports = { authenticateToken }; // Exporterar funktion