const { updateProgress, getProgress } = require("../services/watchService");

async function saveProgress(req, res) {
  try {
    const { userId, profileName, contentId, progressSeconds, durationSeconds } = req.body;

    if (!userId || !contentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await updateProgress({
      userId,
      profileName,
      contentId,
      progressSeconds,
      durationSeconds,
    });

    res.json(result);
  } catch (err) {
    console.error("Error saving progress:", err);
    res.status(500).json({ error: "Failed to save progress" });
  }
}

async function fetchProgress(req, res) {
  try {
    const { userId, profileName, contentId } = req.params;

    const history = await getProgress(userId, profileName, contentId);
    if (!history) return res.json({ progressSeconds: 0 });

    res.json(history);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
}

module.exports = { saveProgress, fetchProgress };
