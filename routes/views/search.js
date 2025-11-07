// Add this to your main routes file (e.g., routes.js or app.js)
const express = require("express");
const router = express.Router();
const { searchContent } = require("../../controllers/search");

// Render the login page
router.get("/", searchContent);

module.exports = router;
