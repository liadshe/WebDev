const mongoose = require("mongoose");

const WatchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    profileName: { type: String },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    watchedAt: { type: Date, default: Date.now },
    progressPercent: { type: Number, default: 0 },
    progressSeconds: { type: Number, default: 0 },
    finished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure unique progress entry per user + profile + content
WatchHistorySchema.index(
  { userId: 1, profileName: 1, contentId: 1 },
  { unique: true }
);

module.exports = mongoose.model("WatchHistory", WatchHistorySchema);
