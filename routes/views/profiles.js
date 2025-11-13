const express = require("express");
const router = express.Router();
const { renderProfilesPage, setActiveProfile } = require("../../controllers/profiles");

// Render the profiles page
router.get("/", renderProfilesPage);

// Route for selecting a profile (sets session.activeProfile)
router.get("/set/:profileId", setActiveProfile);

module.exports = router;
