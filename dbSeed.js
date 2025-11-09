// seedUsers.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Genre = require("./models/Genres");

const MONGO_URI = "mongodb://localhost:27017/Netflix";

const dummyGenres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller",
  "Animation", "Documentary", "Crime", "Family", "War",
  "Western", "Musical", "Biography", "Sport", "History"
];

const pictures = ["cow.jpg", "horse.jpg", "mouse.jpg", "pig.jpg"];

// Dummy ObjectIds (represent liked content references)
const dummyContentIds = Array.from({ length: 10 }, () => new mongoose.Types.ObjectId());

async function seedAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // --- Seed Genres ---
    await Genre.deleteMany({});
    console.log("🧹 Cleared existing genres");

    const genresToInsert = dummyGenres.map(name => ({ name }));
    await Genre.insertMany(genresToInsert);
    console.log(`🎬 Inserted ${dummyGenres.length} genres`);

    // Fetch from DB so we use the actual _ids or names from the DB
    const genresFromDb = await Genre.find({});
    console.log(`📚 Retrieved ${genresFromDb.length} genres from DB`);

    // --- Seed Users ---
    await User.deleteMany({});
    console.log("🧹 Cleared existing users");

    const usersData = [];

    for (let i = 1; i <= 5; i++) {
      const passwordHash = await bcrypt.hash("Aa123456", 10);

      // Each user can have 1–5 profiles
      const profileCount = Math.floor(Math.random() * 5) + 1;
      const profiles = [];

      for (let j = 0; j < profileCount; j++) {
        // Randomly pick 3 genres from DB
        const preferredGenres = [];
        while (preferredGenres.length < 3) {
          const randomGenre = genresFromDb[Math.floor(Math.random() * genresFromDb.length)].name;
          if (!preferredGenres.includes(randomGenre)) preferredGenres.push(randomGenre);
        }

        const likedContent = Array.from(
          { length: 3 },
          () => dummyContentIds[Math.floor(Math.random() * dummyContentIds.length)]
        );

        profiles.push({
          name: `Profile ${j + 1}`,
          picture: pictures[Math.floor(Math.random() * pictures.length)],
          genrePreferences: preferredGenres,
          likedContent,
        });
      }

      usersData.push({
        username: `user${i}`,
        email: `user${i}@example.com`,
        passwordHash,
        profiles,
      });
    }

    await User.insertMany(usersData);
    console.log("✅ Dummy users inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Connection closed");
  }
}

seedAll();