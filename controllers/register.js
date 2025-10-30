const bcrypt = require("bcrypt");
const registerService = require("../services/registerService");
const loginService = require("../services/loginService"); // reuse email check

async function handleRegister(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      req.session.error = "All fields are required";
      req.session.showRegister = true;
      return res.redirect("/login");
    }

    const existingEmail = await loginService.getUserByEmail({ email });
    if (existingEmail) {
      req.session.error = "Email already registered";
      req.session.showRegister = true;
      return res.redirect("/login");
    }

    const existingUsername = await registerService.getUserByUsername({
      username,
    });
    if (existingUsername) {
      req.session.error = "Username already taken";
      req.session.showRegister = true;
      return res.redirect("/login");
    }

    // success path
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await registerService.createUser({
      username,
      email,
      passwordHash,
    });
    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    console.log("User registered:", newUser.username);
    res.redirect("/main");
  } catch (err) {
    console.error("Registration error:", err);
    req.session.error = "Something went wrong during registration";
    req.session.showRegister = true;
    res.redirect("/login");
  }
}

module.exports = { handleRegister };
