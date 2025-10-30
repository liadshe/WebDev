const Log = require("../models/Log");

async function createLog(logData) {
  try {
    const logEntry = new Log(logData);
    await logEntry.save();
  } catch (error) {
    // Log to console if DB logging fails, to not lose the event.
    console.error("Failed to write to log database:", error);
  }
}

module.exports = { createLog };