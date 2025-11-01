const express = require("express");
const router = express.Router();
const { renderMainPage } = require("../../controllers/main");

// Render the login page
router.get("/", renderMainPage);

module.exports = router;
