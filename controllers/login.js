const bcrypt = require("bcrypt");
const User = require("../models/User");
const loginService = require("../services/loginService");

function renderLoginPage(req, res) {
  res.render("login", { error: null });
}

async function handleLogin(req, res) {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await loginService.getUserByUsername({ username });
    if (!user) {
      return res.status(400).render("login", { error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).render("login", { error: "Invalid password" });
    }

    // Create session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    req.session.activeProfile = user.profiles[0]; // default to first profile

    console.log("User logged in:", user.username);

    // Redirect to main page after login
    res.redirect("/main");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", { error: "Something went wrong" });
  }
}

module.exports = {
  handleLogin,
  renderLoginPage,
};
