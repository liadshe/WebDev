const WatchHistory = require("../models/watchHistory");
const mongoose = require("mongoose");
const Episode = require("../models/Episode");

async function hasFinishedSeries(profileName, seriesId, userId) {
  // Find the last episode of the series
  const lastEpisode = await Episode.findOne({ series: seriesId })
    .sort({ seasonNumber: -1, episodeNumber: -1 })
    .lean();

  if (!lastEpisode) {
    return false; // No episodes for this series
  }

  // Check if the user has finished watching the last episode
  const history = await WatchHistory.findOne({
    userId: userId,
    profileName: profileName,
    contentId: lastEpisode._id,
    finished: true,
  });

  return !!history;
}

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

async function getUserDailyWatch(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const result = await WatchHistory.aggregate([
    { $match: { userId: objectId } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$watchedAt" } },
          profile: "$profileName"
        },
        totalSeconds: { $sum: "$progressSeconds" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  return result;
}

// gets user id, profile and content id and returns the watch history per this user, profile and content.
async function getWatchHistoryPerContentByProfileID(contentId, userId, profileName)
{
  const ProfileHistory = await WatchHistory.find({contentId, userId, profileName}).lean();
  return ProfileHistory;
}

async function resetSeriesHistory(profileName, seriesId, userId) {
  // Find all episodes for the series
  const episodes = await Episode.find({ series: seriesId }).select('_id').lean();
  const episodeIds = episodes.map(ep => ep._id);

  if (episodeIds.length === 0) {
    return { message: "No episodes found for this series." };
  }

  // Delete all watch history for these episodes for the given user and profile
  const result = await WatchHistory.deleteMany({
    userId: userId,
    profileName: profileName,
    contentId: { $in: episodeIds },
  });

  return { message: `Reset ${result.deletedCount} episodes for series.` };
}


module.exports = { updateProgress, getProgress, getUserDailyWatch, getWatchHistoryPerContentByProfileID, hasFinishedSeries, resetSeriesHistory };
