const mongoose = require("mongoose");

const WatchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  profileName: { type: String },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
  watchedAt: { type: Date, default: Date.now },
  progressPercent: { type: Number, default: 0 },
  finished: { type: Boolean, default: false }
});

module.exports = mongoose.model("WatchHistory", WatchHistorySchema);