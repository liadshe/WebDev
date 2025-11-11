// seedWatchHistory.js
const mongoose = require("mongoose");
const WatchHistory = require("./models/watchHistory");

async function seedWatchHistory() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Blanflix"); // change to your DB

  const userId = new mongoose.Types.ObjectId("690fbe305f1fcf0377765f29");

  const contents = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
  ];

  const today = new Date();

  // helper to get a date offset by X days
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(today.getDate() - n);
    return d;
  };

  const sampleData = [
    // Profile 1 — watched multiple days
    {
      userId,
      profileName: "Profile 1",
      contentId: contents[0],
      watchedAt: daysAgo(0), // today
      progressPercent: 100,
      progressSeconds: 1000,
      finished: true,
    },
    {
      userId,
      profileName: "Profile 1",
      contentId: contents[1],
      watchedAt: daysAgo(1),
      progressPercent: 60,
      progressSeconds: 1000,
      finished: false,
    },
    {
      userId,
      profileName: "Profile 1",
      contentId: contents[2],
      watchedAt: daysAgo(1),
      progressPercent: 100,
      progressSeconds: 1000,
      finished: true,
    },
    {
      userId,
      profileName: "Profile 1",
      contentId: contents[3],
      watchedAt: daysAgo(3),
      progressPercent: 80,
      progressSeconds: 1000,
      finished: false,
    },

    // Profile 2 — different days
    {
      userId,
      profileName: "Profile 2",
      contentId: contents[4],
      watchedAt: daysAgo(0),
      progressPercent: 100,
      progressSeconds: 1000,
      finished: true,
    },
    {
      userId,
      profileName: "Profile 2",
      contentId: contents[1],
      watchedAt: daysAgo(2),
      progressPercent: 90,
      progressSeconds: 1000,
      finished: true,
    },
    {
      userId,
      profileName: "Profile 2",
      contentId: contents[2],
      watchedAt: daysAgo(3),
      progressPercent: 40,
      progressSeconds: 1000,
      finished: false,
    },
    {
      userId,
      profileName: "Profile 2",
      contentId: contents[3],
      watchedAt: daysAgo(4),
      progressPercent: 100,
      finished: true,
    },

    // profile 3
    {
      userId,
      profileName: "Profile 3",
      contentId: contents[4],
      watchedAt: daysAgo(0),
      progressPercent: 100,
      progressSeconds: 1000,
      finished: true,
    },
  ];

  try {
    await WatchHistory.deleteMany({ userId });
    await WatchHistory.insertMany(sampleData);
    console.log("✅ Dummy watch history inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding WatchHistory:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedWatchHistory();
