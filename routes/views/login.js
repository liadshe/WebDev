const express = require("express");
const router = express.Router();
const { renderLoginPage, handleLogin, handleLogout } = require("../../controllers/login");

// Render the login page
router.get("/", renderLoginPage);

// Handle login form submission
router.post("/", handleLogin);
router.get("/logout", handleLogout);

module.exports = router;