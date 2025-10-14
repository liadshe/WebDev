const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: [{ type: String, index: true }],
  cast: [{ type: String, index: true }],
  releaseYear: { type: Number },
  durationMinutes: { type: Number },
  rating: { type: String }, // from IMDB or similar
  videoUrl: { type: String },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Content", ContentSchema)