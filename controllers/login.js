const bcrypt = require("bcrypt");
const User = require("../models/User");
const loginService = require("../services/loginService");

function renderLoginPage(req, res){
    const error = req.session.error;
    delete req.session.error;
    res.render("login", { error });
};

async function handleLogin(req,res) {
    const { email, password } = req.body;
    
    try {
    // Find user by username
    const user = await loginService.getUserByEmail({ email });
    if (!user) {
        req.session.error = "User not found";
      return res.redirect("/login"); // redirect instead of render
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      req.session.error = "Invalid password";
      return res.redirect("/login");
    }

    // Create session
    req.session.userId = user._id;
    req.session.username = user.username; 
    console.log("User logged in:", user.username);

    // Redirect to main page after login
    res.redirect("/main");

  } catch (err) {
    console.error("Login error:", err);
    req.session.error = "Something went wrong";
    res.redirect("/login");
  }
};

module.exports = {
    handleLogin,
    renderLoginPage
};