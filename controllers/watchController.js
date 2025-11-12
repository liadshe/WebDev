const watchService = require("../services/watchService");

async function saveProgress(req, res) {
  try {
    const { userId, profileName, contentId, progressSeconds, durationSeconds } = req.body;

    if (!userId || !contentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await watchService.updateProgress({
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

    const history = await watchService.getProgress(userId, profileName, contentId);
    if (!history) return res.json({ progressSeconds: 0 });

    res.json(history);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
}

async function handleResetSeriesHistory(req, res) {
  try {
    const { seriesId } = req.body;
    const { _id: userId } = req.session.user;
    const { name: profileName } = req.session.activeProfile;

    if (!seriesId) {
      return res.status(400).json({ error: "Missing seriesId" });
    }

    const result = await watchService.resetSeriesHistory(profileName, seriesId, userId);
    res.json(result);
  } catch (err) {
    console.error("Error resetting series history:", err);
    res.status(500).json({ error: "Failed to reset series history" });
  }
}

module.exports = { saveProgress, fetchProgress, handleResetSeriesHistory };
