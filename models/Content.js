const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: [{ type: String, index: true }],
  cast: [{ type: String, index: true }],
  director: { type: String },
  releaseYear: { type: Number },
  durationMinutes: { type: Number },
  durationSeconds: { type: Number },
  rating: { type: String }, // from IMDB or similar
  videoPath: { type: String },
  coverImagePath: { type: String },
});

module.exports =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);
