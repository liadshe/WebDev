const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const loginViewRouter = require("./routes/views/login");
const settingsViewRouter = require("./routes/views/settings");
const profilesApiRouter = require("./routes/api/profiles");
const contentViewRouter = require("./routes/views/content");

dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Session middleware
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  }));

// views routes
app.use("/main", express.static("main.html"));
app.use("/login",loginViewRouter);
app.use("/profiles", express.static("profiles.html"));
app.use("/settings", settingsViewRouter);
app.use("/content", contentViewRouter);
app.get("/statistics", (req, res) => {
  res.render("statistics");
});

// api routes
app.use("/api/profiles", profilesApiRouter);

const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => {
    console.log("Server is running");
});
