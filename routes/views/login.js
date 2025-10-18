const express = require("express");
const router = express.Router();
const { renderLoginPage, handleLogin } = require("../../controllers/login");

// Render the login page
router.get("/", renderLoginPage);

// Handle login form submission
router.post("/", handleLogin);

module.exports = router;