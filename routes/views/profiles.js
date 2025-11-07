const express = require("express");
const router = express.Router();
const { renderProfilesPage } = require("../../controllers/profiles");

// Render the profiles page
router.get("/", renderProfilesPage);

module.exports = router;
