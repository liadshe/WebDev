const bcrypt = require("bcrypt");
const loginService = require("../services/loginService");
const logService = require("../services/logService");

function renderLoginPage(req, res) {
  const error = req.session.error;
  const showRegister = req.session.showRegister || false;
  delete req.session.error;
  delete req.session.showRegister;
  res.render("login", { error, showRegister });
}


async function handleLogin(req,res) {
    const { email, password } = req.body;
    
    try {
    const user = await loginService.getUserByEmail({ email });
    if (!user) {
        await logService.createLog({
          level: "WARN",
          service: "Auth",
          message: `Failed login attempt: User not found for email '${email}'.`,
        });
        req.session.error = "User not found";
      return res.redirect("/login"); 
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logService.createLog({
        level: "WARN",
        service: "Auth",
        message: `Failed login attempt: Invalid password for user '${user.username}'.`,
        userId: user._id,
      });
      req.session.error = "Invalid password";
      return res.redirect("/login");
    }

    // Create session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    req.session.activeProfile = user.profiles[0]; // default to first profile

    await logService.createLog({
      level: "INFO",
      service: "Auth",
      message: `User '${user.username}' logged in successfully.`,
      userId: user._id,
    });
    console.log("User logged in:", user.username);

    // Redirect to main page after login
    res.redirect("/main");

  } catch (err) {
    await logService.createLog({
      level: "ERROR",
      service: "Auth",
      message: `Login error: ${err.message}.`,
    });
    console.error("Login error:", err);
    req.session.error = "Something went wrong";
    res.redirect("/login");
  }
}

module.exports = {
  handleLogin,
  renderLoginPage,
};
