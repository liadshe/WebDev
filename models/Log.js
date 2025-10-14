const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  level: { type: String, enum: ["INFO", "WARN", "ERROR"], default: "INFO" },
  message: { type: String, required: true },
  service: { type: String }, // e.g. "streaming-api", "auth-service"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profileId: { type: String },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object } // optional field for stack traces, payloads, etc.
});

LogSchema.index({ level: 1, timestamp: -1 });

module.exports = mongoose.model("Log", LogSchema);