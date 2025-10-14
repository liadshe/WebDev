const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const settingsViewRouter = require("./routes/views/settings");
const profilesApirouter = require("./routes/api/profiles");

dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

// Use mongoDB
// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const PORT = parseInt(process.env.PORT);

// views routes
app.use("/main", express.static("main.html"));
app.use("/login", (req, res) => {
  res.render("login");
});
app.use("/profiles", express.static("profiles.html"));
app.use("/settings", settingsViewRouter);
app.get("/statistics", (req, res) => {
  res.render("statistics");
});


// api routes
app.use("/api/profiles", profilesApirouter);

app.listen(PORT, () => {
    console.log("Server is running");
});
