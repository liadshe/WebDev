const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const mainViewRouter = require("./routes/views/main");
const loginViewRouter = require("./routes/views/login");
const registerViewRouter = require("./routes/views/register");
const settingsViewRouter = require("./routes/views/settings");
const contentViewRouter = require("./routes/views/content");
const statisticsViewRouter = require("./routes/views/statistics");
const searchRouter = require("./routes/views/search");
const profilesViewRouter = require("./routes/views/profiles");
const genreViewRouter = require("./routes/views/genre");
const watchViewRouter = require("./routes/views/watch");

const profilesApiRouter = require("./routes/api/profiles");
const watchApiRouter = require("./routes/api/watch");
const statisticsApiRouter = require("./routes/api/statistics");
const contentDetailsApiRouter = require("./routes/api/content-details");
const genreApiRouter = require("./routes/api/genre");

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
app.use("/main", mainViewRouter);
app.use("/login", loginViewRouter);
app.use("/register", registerViewRouter);
app.use("/search", searchRouter);
app.use("/profiles", profilesViewRouter);
app.use("/settings", settingsViewRouter);
app.use("/statistics", statisticsViewRouter);
app.use("/content", contentViewRouter);
app.use("/genre", genreViewRouter);
app.use("/watch", watchViewRouter);

// api routes
app.use("/api/profiles", profilesApiRouter);
app.use("/api/statistics", statisticsApiRouter);
app.use("/api/watch", watchApiRouter);
app.use("/api/contentDetails", contentDetailsApiRouter);
app.use("/api/genre", genreApiRouter);

const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => {
  console.log("Server is running");
});
