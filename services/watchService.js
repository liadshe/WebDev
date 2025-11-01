const WatchHistory = require("../models/watchHistory");

async function updateProgress({
  userId,
  profileName,
  contentId,
  progressSeconds,
  durationSeconds,
}) {
  const progressPercent = Math.min(
    100,
    (progressSeconds / durationSeconds) * 100
  );

  return await WatchHistory.findOneAndUpdate(
    { userId, profileName, contentId },
    {
      watchedAt: new Date(),
      progressSeconds,
      progressPercent,
      finished: progressPercent >= 99,
    },
    { upsert: true, new: true }
  );
}

async function getProgress(userId, profileName, contentId) {
  return await WatchHistory.findOne({ userId, profileName, contentId });
}

module.exports = { updateProgress, getProgress };
