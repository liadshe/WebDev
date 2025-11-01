const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/authMiddleware");
const { renderSettingsPage } = require("../../controllers/settings");
const renderEditProfile = require("../../controllers/profiles");

router.get("/", ensureAuth, renderSettingsPage);
router.get('/edit/:profileId', ensureAuth, renderEditProfile.renderEditProfilePage);
router.get('/createProfile', ensureAuth, renderEditProfile.renderProfileCreationPage);


module.exports = router;