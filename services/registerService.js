const User = require("../models/User");

async function createUser({ username, email, passwordHash, profiles = [] }) {
  try {
    const user = new User({
      username,
      email,
      passwordHash,
      profiles
    });

    await user.save();
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

async function getUserByUsername({ username }) {
  return await User.findOne({ username });
}


module.exports = {
  createUser,
  getUserByUsername,
};
