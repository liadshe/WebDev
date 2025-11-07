const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String,
          enum: ["movie", "series"],
          required: true,
          index: true
        },
  genre: [{ type: String, index: true }],
  cast: [{ type: String, index: true }],
  director: { type: String },
  releaseYear: { type: Number },
  rating: { type: String }, // from IMDB or similar
  videoPath: { type: String },
  coverImagePath: { type: String },

  // for movies only 
  durationSeconds: { type: Number },
  
  // for series only    
  seasonNumber: { type: Number, default: 1 }
}); 

module.exports =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);
