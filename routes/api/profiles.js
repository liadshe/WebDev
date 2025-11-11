const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/profiles");

// Handle updates to a profile
router.post("/update/:profileId", profileController.updateProfile);
router.post("/delete/:profileId", profileController.deleteProfile);
router.post("/createProfile", profileController.createProfile)

module.exports = router;


