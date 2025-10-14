const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  level: { type: String, enum: ["INFO", "WARN", "ERROR"], default: "INFO" },
  message: { type: String, required: true },
  service: { type: String }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profileId: { type: String },
  timestamp: { type: Date, default: Date.now },
});

LogSchema.index({ level: 1, timestamp: -1 });

module.exports = mongoose.model("Log", LogSchema);