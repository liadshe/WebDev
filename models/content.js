const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: [{ type: String, index: true }],
  cast: [{ type: String, index: true }],
  directors: [{ type: String }],
  releaseDate: { type: Date },
  durationMinutes: { type: Number },
  rating: { type: String }, // e.g., "PG-13"
  languages: [{ type: String }],
  subtitles: [{ type: String }],
  thumbnailUrl: { type: String },
  videoUrl: { type: String },
  dateAdded: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
});

module.exports= mongoose.model("Content", ContentSchema);