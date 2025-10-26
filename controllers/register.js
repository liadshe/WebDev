const bcrypt = require("bcrypt");
const loginService = require("../services/loginService");

async function handleRegister(req, res) {
  const { email, password } = req.body;

  try {
    // Find user by username
    try {

    // Validate fields
    if (!username || !email || !password) {
      req.session.error = "All fields are required";
      return res.redirect("/login");
    }

   // Check if user already exists
    const existingUser = await loginService.getUserByEmail({ email });
    if (existingUser) {
      req.session.error = "User already exists";
      return res.redirect("/login");
    }

    //  Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (via service)
    const newUser = await registerService.createUser({
      username,
      email,
      passwordHash,
    });

    // Create session
    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    console.log("User registered:", newUser.username);

    // Redirect to main page after login
    res.redirect("/main");

  } catch (err) {
    console.error("Registration error:", err);
    req.session.error = "Something went wrong during registration";
    res.redirect("/login");
  }
}

module.exports = {
  handleRegister,
};
