const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/authMiddleware");
const { renderSettingsPage, renderEditProfile } = require("../../controllers/settings");

router.get("/", ensureAuth, renderSettingsPage);
router.get('/edit/:profileName', ensureAuth, renderEditProfile);


module.exports = router;