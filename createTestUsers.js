const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected in test user script"))
.catch(err => console.error("MongoDB connection error in test user script:", err));

async function createUser() {
  const passwordHash = await bcrypt.hash("nn", 10);

  const user = new User({
    username: "noa",
    email: "noa@example.com",
    passwordHash: passwordHash,
  });

  await user.save();
  console.log("✅ user created", user);
  mongoose.connection.close();
}

createUser();