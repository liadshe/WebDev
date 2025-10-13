const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Profile = require("./models/Profile");

dotenv.config();
mongoose.connect(process.env.DB_CONNECTION);

