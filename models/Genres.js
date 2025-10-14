const mongoose = require("mongoose");

const GenresSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Genre", GenresSchema);