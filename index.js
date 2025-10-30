const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");

const loginViewRouter = require("./routes/views/login");
const registerViewRouter = require("./routes/views/register");
const settingsViewRouter = require("./routes/views/settings");
const profilesApiRouter = require("./routes/api/profiles");

dotenv.config();
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Session middleware
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// views routes
app.use("/", loginViewRouter);
app.use("/main", express.static("main.html"));
app.use("/login", loginViewRouter);
app.use("/register", registerViewRouter);
app.use("/profiles", express.static("profiles.html"));
app.use("/settings", settingsViewRouter);
app.get("/statistics", (req, res) => {
  res.render("statistics");
});

// api routes
app.use("/api/profiles", profilesApiRouter);

const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => {
  console.log("Server is running");
});
