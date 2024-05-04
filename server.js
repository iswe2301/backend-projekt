const express = require("express"); // Inkluderar express
const mongoose = require("mongoose"); // Inkluderar mongoose
require("dotenv").config(); // Inkluderar env-fil
const cors = require("cors"); // Inkluderar cors

const app = express(); // Startar applikationen med express
const port = process.env.PORT || 3000; // Lagrar variabel för port, startar antingen enligt inställningar i env-filen eller på port 3000

app.use(cors()); // Använder cors för att tillåta alla domäner
app.use(express.json()); // Inkluderar middleware till express för att konvertera data till json automatiskt
app.use(express.static("public")); // Sätter mappen public som statisk mapp

// Inkluderar routes
const userRoutes = require("./routes/userRoutes"); 
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes"); 
const imageRoutes = require("./routes/imageRoutes"); 
const menuRoutes = require("./routes/menuRoutes"); 
const reviewRoutes = require("./routes/reviewRoutes");

// Använder exporterade routes
app.use("/api", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", contactRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/dishes", menuRoutes);
app.use("/api/reviews", reviewRoutes);

// Ansluter till databasen med URL från env-filen
mongoose.set("strictQuery", false); // Använder inte strikt sökning
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Ansluten till MongoDB!");
}).catch((error) => {
    console.error("Fel vid anslutning till databasen...");
});

// Startar applikationen
app.listen(port, () => {
    console.log(`Server körs på port: ${port}`);
});