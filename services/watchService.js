const WatchHistory = require("../models/watchHistory");

/**
 * Update or insert watch progress for a specific user + profile + content
 */
async function updateProgress({
  userId,
  profileName,
  contentId,
  progressSeconds,
  durationSeconds,
}) {
  if (!userId || !contentId) {
    throw new Error("Missing required fields: userId or contentId");
  }

  // Protect against divide by zero
  const progressPercent =
    durationSeconds && durationSeconds > 0
      ? Math.min(100, (progressSeconds / durationSeconds) * 100)
      : 0;

  const finished = durationSeconds && progressSeconds >= durationSeconds - 5; // within 5s of end

  const updated = await WatchHistory.findOneAndUpdate(
    { userId, profileName, contentId }, // <-- includes profile!
    {
      watchedAt: new Date(),
      progressSeconds,
      progressPercent,
      finished,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    message: "Progress saved successfully",
    progress: {
      progressSeconds: updated.progressSeconds,
      progressPercent: updated.progressPercent,
      finished: updated.finished,
    },
  };
}

/**
 * Retrieve saved progress for a user + profile + content
 */
async function getProgress(userId, profileName, contentId) {
  if (!userId || !contentId) {
    throw new Error("Missing required fields: userId or contentId");
  }

  const history = await WatchHistory.findOne({
    userId,
    profileName,
    contentId,
  });

  if (!history) {
    return { progressSeconds: 0, progressPercent: 0, finished: false };
  }

  return {
    progressSeconds: history.progressSeconds,
    progressPercent: history.progressPercent,
    finished: history.finished,
  };
}

module.exports = { updateProgress, getProgress };
