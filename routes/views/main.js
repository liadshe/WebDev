const express = require("express");
const router = express.Router();
const { renderMainPage } = require("../../controllers/watch");

// Render the login page
router.get("/", renderMainPage);

module.exports = router;
