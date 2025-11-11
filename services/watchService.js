const WatchHistory = require("../models/watchHistory");
const mongoose = require("mongoose");

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


module.exports = { updateProgress, getProgress, getUserDailyWatch };
