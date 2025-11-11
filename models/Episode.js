const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  seasonNumber: { type: Number, required: true },
  episodeNumber: { type: Number, required: true },
  releaseDate: { type: Date },
  durationSeconds: { type: Number },
  videoPath: { type: String },

  // Relationship: each episode belongs to a series
  series: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
  uploadTime: { type: Date, default: Date.now }

});

// create a unique index to prevent duplicate episodes in the same season of a series
EpisodeSchema.index({ series: 1, seasonNumber: 1, episodeNumber: 1 }, { unique: true });

module.exports = mongoose.models.Episode || mongoose.model("Episode", EpisodeSchema);
