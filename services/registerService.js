const User = require("../models/User");

async function createUser({ username, email, passwordHash }) {
  try {
    const user = new User({
      username,
      email,
      passwordHash,
    });

    await user.save();
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

module.exports = {
  createUser,
};
