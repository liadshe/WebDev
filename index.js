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

app.use("/settings", settingsViewRouter);
app.use("/api/profiles", profilesApirouter);

app.listen(PORT, () => {
    console.log("Server is running");
});
